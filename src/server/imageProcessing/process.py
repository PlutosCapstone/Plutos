from PIL import Image, ImageEnhance, ImageFilter
import pandas as pd
import pytesseract
import numpy as np
from dotenv import load_dotenv
import os

from server.imageProcessing.categorization import Categorizer
import server.imageProcessing.utils as utils

load_dotenv()

pytesseract.pytesseract.tesseract_cmd = os.getenv('TESSERACT_PATH')
pd.set_option("display.max_rows", None)


class ImageProcessor:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ImageProcessor, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self.categorizer = Categorizer()

    def _extract_text_from_image(self, filename: str, show_image: bool = False):
        image = Image.open(filename)
        image = image.convert("L")  # convert to greyscale
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2)

        image = image.filter(ImageFilter.MedianFilter())
        if show_image:
            image.show()
        image_arr = np.array(image)

        text = pytesseract.image_to_string(image_arr, config="--psm 4")

        # TODO(ang): helpful for debugging for fixing model but keep commented for commits
        # data = pytesseract.image_to_data(
        #     image_arr, output_type=pytesseract.Output.DICT
        # )
        # print(pd.DataFrame(data).query("conf > 0"))
        print(text)
        return text.split("\n")


    def _process_items_list(self, text_arr: list) -> tuple:
        subtotal = 0

        items = []
        curr_item = None
        for i, line in enumerate(text_arr):
            if "subtotal" in line.lower():
                subtotal = line.split(" ")[-1]
                break
            if line != "":
                line_arr = line.split(" ")
                if line_arr[0] == "Saving":
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
        calculated_total = 0
        for item in items:
            item_name, item_price = utils.split_item(item[0])
            if item_price:
                calculated_total += item_price

        return items, subtotal, calculated_total


    def _jsonify_data(self, items: list, filename: str, write_to_file: bool = False):
        items_cleaned = []
        with open(f"{filename}_results.csv", "w+") as f:
            for item in items:
                item_name, item_price = utils.split_item(item[0])
                if item_name:
                    items_cleaned.append([item_name, item_price])
                    f.write(item_name + "\n")
                else:
                    print("**error with item", item[0])
        return pd.DataFrame(items_cleaned, columns=["name", "price"])


    def process_image(self, filepath: str):
        text_arr = self._extract_text_from_image(filepath, show_image=False)
        items, subtotal, calculated_total = self._process_items_list(text_arr)
        data = self._jsonify_data(items, filepath)

        categorized_data = self.categorizer.categorize(data)

        items_formatted = []
        result = {
            "items": items_formatted,
            "subtotal": subtotal,
            "calculated_total": calculated_total,
        }
        for i, row in categorized_data.iterrows():
            items_formatted.append({
                "id": i + 1,
                "name": row["name"],
                "price": row["price"],
                "category": row["category"]
            })
        
        return result
