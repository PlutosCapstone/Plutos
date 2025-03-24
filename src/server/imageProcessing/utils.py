import re
import calendar


def is_float(value):
    value = value.strip()

    # handle negative signs
    if value.startswith("-"):
        value = value[1:]

    # remove decimal point for digit check
    if "." in value:
        value = value.replace(".", "", 1)
    # remove dollar sign
    if "$" in value:
        value = value.replace("$", "", 1)

    return value.isdigit()


def split_item(item: str, verbose=False):
    """
    (tries to) split a string into item name and price
    """
    pattern = r"(.+?)(\s\d+.*)?\s((\$)?\d+[\s\.\,]+\d{0,2})"
    match = re.search(pattern, item)

    if match:
        # clean up item name
        item_name_raw = list(match.group(1))
        item_name = "".join(
            [ch for ch in item_name_raw if ch.isalnum() or ch in [" ", ".", "-"]]
        )
        if not any(ch.isalpha() for ch in item_name):
            if verbose:
                print(
                    "Item name does not contain any alphabetic characters, skipping",
                    item,
                )
            return None, 0

        # clean up price
        value = []
        for ch in match.group(3):
            if ch.isdigit() or ch == ".":
                value.append(ch)
        price = float("".join(value))
        if price > 100:
            if verbose:
                print("Price seems too high, skipping", item)
            return None, 0

        return item_name, price
    else:
        if verbose:
            print("No match found.", item)
        return None, 0


list_months = list(calendar.month_abbr)[1:]


def parse_date(text: str):
    """
    Parse a date from a string
    """
    for month in list_months:
        if month.lower() in text.lower()[:3]:
            return True
    return False
