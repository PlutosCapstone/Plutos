from flask import Blueprint, jsonify, request
from server.controllers.expenses.expenses_controller import ExpensesController

expenses = Blueprint('expenses', __name__)

@expenses.route('/<userId>', methods=['GET'])
def getExpenses(userId):
    return jsonify(ExpensesController.get_all_expenses(userId))


@expenses.route('/', methods=['POST', 'OPTIONS'])
def addExpenses():
    new_expense = ExpensesController.create_expense(request)
    return jsonify(new_expense), 201