from server.models.transactions.transaction import Transaction
from server.db import db
from server.daos.expenses.expenses_dao import ExpensesDao


class TransactionsDao:
    @staticmethod
    def get(user_id, start_date, end_date):
        response = (
            db.table("transactions")
            .select("*")
            .eq("user_id", user_id)
            .gte("date", start_date)
            .lte("date", end_date)
            .execute()
        )
        transactions = response.data

        for transaction in transactions:
            expenses = ExpensesDao.get_by_transaction(transaction["id"])
            transaction["expenses"] = expenses

        return transactions

    @staticmethod
    def create(data):
        transaction = Transaction.from_dict(data)
        new_transaction = (
            db.table("transactions").insert(transaction.to_dict()).execute()
        )

        expenses = data["expenses"]
        for expense in expenses:
            expense["transaction_id"] = transaction.id
        expenses = ExpensesDao.bulk_create_expenses(expenses)

        return new_transaction.data
