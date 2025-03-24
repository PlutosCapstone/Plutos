from server.daos.budget.budget_dao import BudgetDao


class BudgetController:
    @staticmethod
    def get_all_budgets(userId):
        return BudgetDao.get_all_user_budgets(userId)

    @staticmethod
    def create_budget(data):
        return BudgetDao.create_budget(data.json)

    @staticmethod
    def update_budget(budgetId, updatedData):
        return BudgetDao.update_budget(budgetId, updatedData.json)

    @staticmethod
    def delete_budget(budgetId):
        return BudgetDao.delete_budget(budgetId)
