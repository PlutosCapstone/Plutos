from dotenv import load_dotenv
import os

import cv2
import numpy as np
import pandas as pd
import pytesseract
import Levenshtein as lev

from server.imageProcessing.categorization import Categorizer
import server.imageProcessing.utils as utils
from server.models import Receipt, Expense

load_dotenv()

pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_PATH")
pd.set_option("display.max_rows", None)


class ImageProcessor:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ImageProcessor, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self.categorizer = Categorizer()

    def _preprocess_image(self, image: np.array) -> np.array:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        denoised = cv2.fastNlMeansDenoising(gray, None, 30, 7, 21)
        threshold_img = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        return threshold_img

    def _extract_text_from_image(self, image: np.array, verbose=False) -> list[str]:
        text = pytesseract.image_to_string(image, config="--psm 4")
        if verbose:
            print(text)
        return text.split("\n")

    def _process_items_list(self, text_arr: list) -> tuple:
        subtotal = 0
        date = None

        items = []
        curr_item = None
        for i, line in enumerate(text_arr):
            if line != "":
                line_arr = line.split(" ")
                if lev.distance(line_arr[0].lower(), "subtotal") <= 1:
                    subtotal = utils.split_item(line)[1]
                    continue
                if utils.parse_date(line):
                    date = line
                    curr_item = None
                    continue
                if subtotal == 0:
                    if lev.distance(line_arr[0].lower(), "saving") <= 1:
                        if items:
                            items[-1].append(line)
                        continue
                    if "points" in line.lower():
                        continue
                    if not curr_item:
                        curr_item = line
                    else:
                        curr_item += " " + line
                    if utils.is_float(line_arr[-1]) or (
                        len(line_arr) > 2 and utils.is_float(line_arr[-2])
                    ):
                        items.append([curr_item])
                        curr_item = None
                if subtotal > 0 and date:
                    break

        calculated_total = 0
        for item in items:
            item_name, item_price = utils.split_item(item[0])

            if item_price:
                calculated_total += item_price

        receipt = Receipt(
            merchent_name="",
            date=date,
            calculated_total=round(calculated_total, 2),
            subtotal=subtotal,
            items=[],
        )
        return receipt, items

    def _jsonify_data(self, items: list, verbose=False) -> pd.DataFrame:
        items_cleaned = []

        for item in items:
            item_name, item_price = utils.split_item(item[0])
            if item_name:
                items_cleaned.append([item_name, item_price])
            elif verbose:
                print("**error with item", item[0])

        return pd.DataFrame(items_cleaned, columns=["name", "price"])

    def _format_item_results(
        self, receipt: Receipt, categorized_data: pd.DataFrame
    ) -> None:
        for i, row in categorized_data.iterrows():
            expense = Expense(
                name=row["name"],
                raw_name=row["name"],
                transaction_date=None,
                cost=row["price"],
                category=row["category"],
                email=None,
            )
            receipt.add_item(expense)

    def _parse_image(self, filepath: str):
        image = cv2.imread(filepath)
        image = self._preprocess_image(image)

        # process image through OCR
        text_arr = self._extract_text_from_image(image=image)

        # make sense of the text
        receipt, raw_items = self._process_items_list(text_arr)
        data = self._jsonify_data(raw_items)

        return receipt, data

    def process_image(self, filepath: str):
        # parse data from image
        receipt, data = self._parse_image(filepath)

        # categorize data from image
        categorized_data = self.categorizer.categorize(data)
        self._format_item_results(receipt, categorized_data)

        return receipt
