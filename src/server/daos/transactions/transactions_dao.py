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
            .order("date", desc=True)
            .execute()
        )
        transactions = response.data

        for transaction in transactions:
            expenses = ExpensesDao.get_by_transaction(transaction["id"])
            transaction["expenses"] = expenses

        return transactions

    @staticmethod
    def _add_expenses_to_transaction(transaction_id, expenses):
        if not expenses:
            return
        for expense in expenses:
            expense["transaction_id"] = transaction_id
        return ExpensesDao.bulk_create_expenses(expenses)

    @staticmethod
    def create(data):
        transaction = Transaction.from_dict(data)
        new_transaction = (
            db.table("transactions").insert(transaction.to_dict()).execute()
        )

        TransactionsDao._add_expenses_to_transaction(transaction.id, data["expenses"])

        return new_transaction.data

    @staticmethod
    def update(transaction_id, data):
        transaction = Transaction.from_dict(data)

        updated_transaction = (
            db.table("transactions")
            .update(transaction.to_dict(include_id=False))
            .eq("id", transaction_id)
            .execute()
        )
        ExpensesDao.bulk_delete_from_transaction(transaction_id)

        TransactionsDao._add_expenses_to_transaction(transaction_id, data["expenses"])

        return updated_transaction.data
