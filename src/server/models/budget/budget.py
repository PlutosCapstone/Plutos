from datetime import datetime, timezone


class Budget:
    def __init__(self, amount, category, email):
        self.amount = amount
        self.category = category
        self.email = email
        self.created_at = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "amount": self.amount,
            "category": self.category,
            "email": self.email,
            "created_at": (
                self.created_at.isoformat()
                if isinstance(self.created_at, datetime)
                else self.created_at
            ),
        }
