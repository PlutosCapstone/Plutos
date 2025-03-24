from flask import Blueprint, jsonify, request
from server.controllers.users.users_controller import UsersController

users = Blueprint("users", __name__)


@users.route("/<email>", methods=["GET"])
def getUser(email):
    return jsonify(UsersController.get_user_by_email(email))


@users.route("/", methods=["POST", "OPTIONS"])
def createUser():
    new_user = UsersController.create_user(request)
    return jsonify(new_user), 201


@users.route("/<email>", methods=["PUT"])
def updateUser(email):
    return jsonify(UsersController.update_user(email, request))


@users.route("/<email>", methods=["DELETE"])
def deleteUser(email):
    return jsonify(UsersController.delete_user(email))
