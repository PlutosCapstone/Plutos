from datetime import datetime


class Transaction:
    def __init__(self, date, store, user_id):
        self.date = date
        self.store = store
        self.user_id = user_id

    def to_dict(self):
        return {
            "date": (
                self.date.isoformat()
                if isinstance(self.date, datetime)
                else self.date
            ),
            "store": self.store,
            "user_id": self.user_id,
        }
