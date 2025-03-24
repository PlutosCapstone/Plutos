from server.models.users.user import User
from server.db import db


class UsersDao:
    @staticmethod
    def get_user_by_email(email):
        response = db.table("users").select("*").eq("email", email).execute()
        return response.data

    @staticmethod
    def create_user(data):
        new_user = User(
            first_name=data["first_name"],
            middle_name=data["middle_name"],
            last_name=data["last_name"],
            email=data["email"],
            dob=data["dob"],
            sex=data["sex"],
            occupation=data["occupation"],
        )
        response = db.table("users").insert(new_user.to_dict()).execute()
        return response.data

    @staticmethod
    def update_user(userEmail, updatedData):
        response = (
            db.table("users").update(updatedData).eq("email", userEmail).execute()
        )
        return response.data

    @staticmethod
    def delete_user(userEmail):
        response = db.table("users").delete().eq("email", userEmail).execute()
        return response.data
