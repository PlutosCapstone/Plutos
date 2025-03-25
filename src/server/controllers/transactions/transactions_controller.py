from server.daos.transactions.transactions_dao import TransactionsDao


class TransactionsController:
    @staticmethod
    def get(user_id, start_date, end_date):
        return TransactionsDao.get(user_id, start_date, end_date)

    def create(data):
        return TransactionsDao.create(data)

    def update(transaction_id, data):
        return TransactionsDao.update(transaction_id, data)
