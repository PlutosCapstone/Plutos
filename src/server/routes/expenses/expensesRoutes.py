from flask import Blueprint, jsonify, request
from server.controllers.expenses.expenses_controller import ExpensesController

expenses = Blueprint("expenses", __name__)


@expenses.route("/<userId>", methods=["GET"])
def getExpenses(userId):
    flag = request.args.get("flag", "false").lower() == "true"
    return jsonify(ExpensesController.get_all_expenses(userId, flag))


@expenses.route("/parse", methods=["POST"])
def parseExpense():
    new_expense = ExpensesController.parse_expense(request)
    return new_expense, 200


@expenses.route("/", methods=["POST"])
def addExpense():
    data = request.get_json()
    new_expense = ExpensesController.add_expense(data)
    return new_expense, 201


@expenses.route("/<expenseId>", methods=["PUT", "OPTIONS"])
def updateExpense(expenseId):
    updated_expense = ExpensesController.update_expense(request, expenseId)
    return jsonify(updated_expense), 201


@expenses.route("/<expenseId>", methods=["DELETE"])
def deleteExpense(expenseId):
    ExpensesController.delete_expense(expenseId)
    return jsonify(expenseId), 201
