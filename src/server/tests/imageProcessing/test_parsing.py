import sys
import os

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
)

from server.imageProcessing.process import ImageProcessor  # noqa: E402

processor = ImageProcessor()
base_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data/parsing")


def _test_parse_image(receipt_filepath: str, filename: str):
    output_filename = os.path.join(base_path, "output", filename + ".output.csv")
    receipt, data = processor._parse_image(receipt_filepath)
    data = data[["name", "price"]]
    with open(output_filename, "w") as f:
        f.write(data.to_csv())


def test_parse_images():
    image_path = os.path.join(base_path, "input")
    files = os.listdir(image_path)
    for file in files:
        _test_parse_image(os.path.join(image_path, file), file)
