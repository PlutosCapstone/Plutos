import sys
import os
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from server.imageProcessing.categorization import Categorizer  # noqa: E402

categorizer = Categorizer()
base_path = os.path.dirname(os.path.abspath(__file__))


def test_categorization():
    with open(
        os.path.join(base_path, "data/categorization/receipt_items_input.csv"), "r"
    ) as f:
        items = pd.read_csv(f)
    with open(
        os.path.join(
            base_path, "data/categorization/receipt_items_expected_output.csv"
        ),
        "r",
    ) as f:
        expected_output = pd.read_csv(f)

    output = categorizer.categorize(items=items)
    with open(
        os.path.join(base_path, "data/categorization/receipt_items_output.csv"), "w"
    ) as f:
        f.write(output.to_csv(index=False))

    points = 0
    expected_categories = expected_output["category"].tolist()
    actual_categories = output["category"].tolist()
    for i in range(len(expected_categories)):
        if expected_categories[i] == actual_categories[i]:
            points += 1
    accuracy = points / len(expected_categories)
    print(f"Accuracy: {accuracy}")
    assert accuracy >= 0.8
