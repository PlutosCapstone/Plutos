from server.daos.expenses.expenses_dao import ExpensesDao
from flask import jsonify


class ExpensesController:
    @staticmethod
    def get_all_expenses(userId, flag):
        if flag:
            return ExpensesDao.get_all_user_expenses_for_current_month(userId)
        return ExpensesDao.get_all_user_expenses(userId)

    @staticmethod
    def parse_expense(data):
        if data.files:
            if "receipt" not in data.files:
                return jsonify({"error": "No receipt file provided"}), 400

            return ExpensesDao.process_receipt(data.files["receipt"])
        else:
            return jsonify({"error": "No file provided"}), 400

    @staticmethod
    def add_expense(data):
        if type(data) is list:
            return ExpensesDao.bulk_create_expenses(data)
        else:
            return ExpensesDao.create_expense(data)

    @staticmethod
    def update_expense(data, expenseId):
        return ExpensesDao.update_expense(data.json, expenseId)

    @staticmethod
    def delete_expense(expenseId):
        return ExpensesDao.delete_expense(expenseId)
