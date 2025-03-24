from flask import Blueprint, jsonify, request
from server.controllers.budget.budget_controller import BudgetController

budget = Blueprint("budget", __name__)


@budget.route("/<userId>", methods=["GET"])
def getBudgets(userId):
    return jsonify(BudgetController.get_all_budgets(userId))


@budget.route("/", methods=["POST", "OPTIONS"])
def createBudget():
    new_budget = BudgetController.create_budget(request)
    return jsonify(new_budget), 201


@budget.route("/<budgetId>", methods=["PUT"])
def updateBudget(budgetId):
    return jsonify(BudgetController.update_budget(budgetId, request))


@budget.route("/<budgetId>", methods=["DELETE"])
def deleteBudget(budgetId):
    return jsonify(BudgetController.delete_budget(budgetId))
