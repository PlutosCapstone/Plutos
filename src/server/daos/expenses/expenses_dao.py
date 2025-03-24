from flask import jsonify
import os

from server.models.expenses.expense import Expense
from server.imageProcessing import ImageProcessor
from server.db import db
import datetime



base_path = os.path.dirname(os.path.abspath(__file__))
tmp_path = os.path.join(base_path, "tmp")

image_processor = ImageProcessor()

current_month_start = (
    datetime.datetime.utcnow()
    .replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    .isoformat()
)


class ExpensesDao:
    @staticmethod 
    def get_all_user_expenses_for_current_month(userId):
        try:
            expenses = (
                db.from_("expenses")
                .select("*, users(*)")
                .order("transaction_date", desc=True)
                .eq("users.userid", userId)
                .gte("transaction_date", current_month_start)
                .execute()
            )

            if "error" in expenses and expenses["error"]:
                raise Exception(f"Supabase Query Error: {expenses['error']}")

        except Exception as e:
            print(f"Unexpected Error: {e}")

        return expenses.data

    @staticmethod
    def get_all_user_expenses(userId):
        try:
            expenses = (
                db.from_("expenses")
                .select("*, users!inner(email, userid)")
                .eq("users.userid", userId)
                .order("transaction_date", desc=True)
                .execute()
            )

            if "error" in expenses and expenses["error"]:
                raise Exception(f"Supabase Query Error: {expenses['error']}")

        except Exception as e:
            print(f"Unexpected Error: {e}")

        return expenses.data

    @staticmethod
    def create_expense(data):
        expense_data = Expense.from_dict(data)
        new_expense = db.table("expenses").insert(expense_data.to_dict()).execute()
        return jsonify(new_expense.data)

    @staticmethod
    def bulk_create_expenses(data):
        expense_data = []

        for expense in data:
            expense_data.append(Expense.from_dict(expense).to_dict())

        new_expenses = db.table("expenses").insert(expense_data).execute()
        return jsonify(new_expenses.data)

    @staticmethod
    def update_expense(data, expense_id):
        expense_data = Expense(
            raw_name=data["raw_name"],
            name=data["name"],
            transaction_date=data["transaction_date"],
            cost=data["cost"],
            category=data["category"],
            email=data["email"],
        )
        updated_expense = (
            db.table("expenses")
            .update(expense_data.to_dict())
            .eq("id", expense_id)
            .execute()
        )
        return updated_expense.data

    @staticmethod
    def delete_expense(expense_id):
        db.table("expenses").delete().eq("id", expense_id).execute()
        return expense_id

    @staticmethod
    def process_receipt(file):
        try:
            tmp_filepath = os.path.join(tmp_path, file.filename)
            file.save(tmp_filepath)

            print(f"Temporary file saved at: {tmp_filepath}")
            data = image_processor.process_image(tmp_filepath)
            # TODO(ang): remove the temp file (keep it for now for debugging)

        except Exception as e:
            print(e)
            return {"error": "Error processing receipt"}
        return data.to_dict()
