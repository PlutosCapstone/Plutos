from server.models import Expense


class Receipt:
    def __init__(
        self,
        merchent_name: str,
        date: str,
        calculated_total: float,
        subtotal: float,
        items: list = [],
    ):
        self.merchent_name = merchent_name
        self.date = date
        self.calculated_total = calculated_total
        self.subtotal = subtotal
        self.items = items

    def add_item(self, item: Expense):
        self.items.append(item)

    def to_dict(self):
        return {
            "merchent_name": self.merchent_name,
            "date": self.date,
            "calculated_total": self.calculated_total,
            "subtotal": self.subtotal,
            "items": [item.to_dict() for item in self.items],
        }
