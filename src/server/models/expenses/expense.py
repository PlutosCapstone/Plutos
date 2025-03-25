from datetime import datetime


class Expense:
    def __init__(
        self,
        raw_name,
        name,
        cost,
        category,
        transaction_date,
        email,
        transaction_id=None,
    ):
        self.raw_name = raw_name
        self.name = name
        self.transaction_date = transaction_date
        self.cost = cost
        self.category = category
        self.email = email
        self.transaction_id = transaction_id

    def to_dict(self):
        return {
            "name": self.name,
            "raw_name": self.raw_name,
            "cost": self.cost,
            "category": self.category.lower(),
            "transaction_date": self.transaction_date,
            "email": self.email,
            "transaction_id": str(self.transaction_id) if self.transaction_id else None,
        }

    @staticmethod
    def from_dict(data):
        today = datetime.today().strftime("%Y-%m-%d")
        return Expense(
            name=data.get("name"),
            raw_name=data.get("raw_name", data.get("name")),
            cost=data.get("cost"),
            category=data.get("category") or "other",
            transaction_date=data.get("transaction_date") or today,
            email=data.get("email"),
            transaction_id=data.get("transaction_id"),
        )
