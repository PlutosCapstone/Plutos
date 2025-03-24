from datetime import datetime
import uuid


class Transaction:
    def __init__(self, date, store, user_id, expenses=[]):
        self.id = uuid.uuid4()
        self.date = date
        self.store = store
        self.user_id = user_id
        self.expenses = expenses

    def to_dict(self):
        return {
            "id": str(self.id),
            "date": (
                self.date.isoformat() if isinstance(self.date, datetime) else self.date
            ),
            "store": self.store,
            "user_id": self.user_id,
        }

    @staticmethod
    def from_dict(data):
        return Transaction(
            date=data.get("date"),
            store=data.get("store"),
            user_id=data.get("userId"),
            expenses=[],
        )
