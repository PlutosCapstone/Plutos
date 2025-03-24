from server.models.budget.budget import Budget
from server.db import db


class BudgetDao:
    @staticmethod
    def get_all_user_budgets(userId):
        try:
            budgets = (
                db.from_("budget")
                .select("*, users!inner(email, userid)")
                .eq("users.userid", userId)
                .order("created_at", desc=True)
                .execute()
            )

            if "error" in budgets and budgets["error"]:
                raise Exception(f"Supabase Query Error: {budgets['error']}")

        except Exception as e:
            print(f"Error fetching budgets: {e}")

        return budgets.data

    @staticmethod
    def create_budget(data):
        new_budget = Budget(
            amount=data["amount"], category=data["category"], email=data["email"]
        )
        response = db.table("budget").insert(new_budget.to_dict()).execute()
        return response.data

    @staticmethod
    def update_budget(budgetId, updatedData):
        response = db.table("budget").update(updatedData).eq("id", budgetId).execute()
        return response.data

    @staticmethod
    def delete_budget(budgetId):
        response = db.table("budget").delete().eq("id", budgetId).execute()
        return response.data
