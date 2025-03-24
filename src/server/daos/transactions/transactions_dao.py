from server.models.transactions.transaction import Transaction
from server.db import db
from server.daos.expenses.expenses_dao import ExpensesDao
import datetime


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
