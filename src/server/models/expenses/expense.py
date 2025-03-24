from datetime import datetime


class Expense:
    def __init__(self, raw_name, name, cost, category, transaction_date, email):
        self.raw_name = raw_name
        self.name = name
        self.transaction_date = transaction_date
        self.cost = cost
        self.category = category
        self.email = email

    def to_dict(self):
        return {
            "name": self.name,
            "raw_name": self.raw_name,
            "cost": self.cost,
            "category": self.category,
            "transaction_date": self.transaction_date,
            "email": self.email,
        }

    @staticmethod
    def from_dict(data):
        today = datetime.today().strftime("%Y-%m-%d")
        return Expense(
            name=data.get("name"),
            raw_name=data.get("raw_name", data.get("name")),
            cost=data.get("cost"),
            category=data.get("category") or "Other",
            transaction_date=data.get("transaction_date") or today,
            email=data.get("email"),
        )
