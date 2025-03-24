import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app import app  # noqa: E402


@pytest.fixture
def client():
    with app.test_client() as client:
        app.testing = True

        # Mock data
        app.expenses = {
            "raw_name": "Costco Hot Diggity Dog",
            "name": "Glizzy Prime",
            "cost": 1.50,
            "category": "groceries",
            "email": "hi@email.com",
            "transaction_date": "2025-03-08 20:38:31.390804",
        }
        yield client


""" POST """


def test_create_expense(client):
    mock_data = app.expenses
    # Cleanup by test_delete_expense()
    response = client.post("/api/expenses/", json=mock_data)
    print(response.status_code)
    assert response.status_code == 201


""" GET """


def test_get_expenses_valid_expense(client):
    mock_email = app.expenses["email"]
    res = client.get(f"/api/users/{mock_email}")
    id = res.get_json()[0]["userid"]

    response = client.get(f"/api/expenses/{id}")
    assert response.status_code == 200

    expense_list = response.get_json()
    for expense in expense_list:
        assert expense["email"] == mock_email


""" PUT """


def test_update_expense(client):
    mock_email = app.expenses["email"]
    res = client.get(f"/api/users/{mock_email}")
    id = res.get_json()[0]["userid"]

    response = client.get(f"/api/expenses/{id}")
    assert response.status_code == 200
    expenses = response.get_json()
    lastId = expenses[len(expenses) - 1]["id"]

    mock_data = app.expenses
    mock_data["cost"] += 100

    updatedRes = client.put(f"/api/expenses/{lastId}", json=mock_data)
    assert updatedRes.status_code == 201

    data = updatedRes.get_json()[0]
    assert data["email"] == mock_email


""" DELETE """


def test_delete_expense(client):
    mock_email = app.expenses["email"]
    res = client.get(f"/api/users/{mock_email}")
    id = res.get_json()[0]["userid"]

    response = client.get(f"/api/expenses/{id}")
    assert response.status_code == 200
    expenses = response.get_json()
    last_id = expenses[len(expenses) - 1]["id"]

    deletedRes = client.delete(f"/api/expenses/{last_id}")
    assert deletedRes.status_code == 201

    expense_id = deletedRes.get_json()
    assert int(expense_id) == last_id
