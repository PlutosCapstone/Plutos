from server.daos.expenses.expenses_dao import ExpensesDao
from flask import jsonify

class ExpensesController:
    @staticmethod
    def get_all_expenses(userId):
        return ExpensesDao.get_all_user_expenses(userId)

    @staticmethod
    def create_expense(data):
        if data.files:
            if 'receipt' not in data.files:
                return jsonify({"error": "No receipt file provided"}), 400
            
            return ExpensesDao.process_receipt(data.files['receipt'])
        
        return ExpensesDao.create_expense(data.json)
    
