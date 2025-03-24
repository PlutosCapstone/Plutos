from server.daos.users.users_dao import UsersDao


class UsersController:
    @staticmethod
    def get_user_by_email(email):
        return UsersDao.get_user_by_email(email)

    @staticmethod
    def create_user(data):
        return UsersDao.create_user(data.json)

    @staticmethod
    def update_user(email, updatedData):
        return UsersDao.update_user(email, updatedData.json)

    @staticmethod
    def delete_user(email):
        return UsersDao.delete_user(email)
