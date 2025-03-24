from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    app.config["SECRET_KEY"] = ""

    from server.routes.expenses.expensesRoutes import expenses

    app.register_blueprint(expenses, url_prefix="/api/expenses")

    from server.routes.incomes.incomesRoutes import incomes

    app.register_blueprint(incomes, url_prefix="/api/incomes")

    from server.routes.users.usersRoutes import users

    app.register_blueprint(users, url_prefix="/api/users")

    from server.routes.budget.budgetRoutes import budget

    app.register_blueprint(budget, url_prefix="/api/budget")

    from server.routes.transactions.transactionsRoutes import transactions
    app.register_blueprint(transactions, url_prefix="/api/transactions")

    return app
