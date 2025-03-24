from flask import Blueprint, jsonify, request
from server.controllers.incomes.incomes_controller import IncomesController

incomes = Blueprint("incomes", __name__)


@incomes.route("/<userEmail>", methods=["GET"])
def getIncomes(userEmail):
    return jsonify(IncomesController.get_all_incomes(userEmail))


@incomes.route("/", methods=["POST", "OPTIONS"])
def createIncome():
    new_income = IncomesController.create_income(request)
    return jsonify(new_income), 201


@incomes.route("/<incomeId>", methods=["PUT"])
def updateIncome(incomeId):
    return jsonify(IncomesController.update_income(incomeId, request))


@incomes.route("/<incomeId>", methods=["DELETE"])
def deleteIncome(incomeId):
    return jsonify(IncomesController.delete_income(incomeId))
