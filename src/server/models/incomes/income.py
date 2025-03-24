from datetime import datetime, timezone


class Income:
    def __init__(self, title, amount, recurring, frequency, email):
        self.title = title
        self.amount = amount
        self.recurring = recurring
        self.frequency = frequency  # Not a required field
        self.email = email
        self.created_at = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "title": self.title,
            "amount": self.amount,
            "recurring": self.recurring,
            "frequency": self.frequency,
            "email": self.email,
            "created_at": (
                self.created_at.isoformat()
                if isinstance(self.created_at, datetime)
                else self.created_at
            ),
        }
