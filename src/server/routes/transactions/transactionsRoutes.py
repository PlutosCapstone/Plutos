from flask import Blueprint, jsonify, request
from server.controllers.transactions.transactions_controller import (
    TransactionsController,
)
from datetime import datetime, timedelta

transactions = Blueprint("transactions", __name__)


@transactions.route("/<userId>", methods=["GET"])
def getTransactions(userId):
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if start_date is None:
        start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    if end_date is None:
        end_date = (datetime.now()).strftime("%Y-%m-%d")

    return jsonify(TransactionsController.get(userId, start_date, end_date))


@transactions.route("/", methods=["POST"])
def createTransaction():
    data = request.get_json()
    new_transaction = TransactionsController.create(data)

    return jsonify(new_transaction), 201


@transactions.route("/<transactionId>", methods=["PUT"])
def updateTransaction(transactionId):
    data = request.get_json()
    updated_transaction = TransactionsController.update(transactionId, data)

    return jsonify(updated_transaction), 201


@transactions.route("/stores/<userId>", methods=["GET"])
def getStores(userId):
    stores = TransactionsController.get_stores_by_userid(userId)
    return stores.json()


@transactions.route("/<transactionId>", methods=["DELETE"])
def deleteTransaction(transactionId):
    deleted_transaction_id = TransactionsController.delete(transactionId)
    return jsonify(deleted_transaction_id), 201
