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
        app.budget = {
            "amount": 1000,
            "email": "test4@test.com",
            "category": "groceries",
        }
        yield client


""" POST """


def test_create_budget(client):
    mock_data = app.budget
    # Cleanup by test_delete_budget()
    response = client.post("/api/budget/", json=mock_data)
    print(response.status_code)
    assert response.status_code == 201


""" GET """


def test_get_budget(client):
    mock_email = app.budget["email"]
    res = client.get(f"/api/users/{mock_email}")
    id = res.get_json()[0]["userid"]

    response = client.get(f"/api/budget/{id}")
    assert response.status_code == 200

    budget_list = response.get_json()
    for budget in budget_list:
        assert budget["email"] == mock_email


""" PUT """


def test_update_budget(client):
    mock_email = app.budget["email"]
    res = client.get(f"/api/users/{mock_email}")
    id = res.get_json()[0]["userid"]

    response = client.get(f"/api/budget/{id}")
    assert response.status_code == 200
    budget = sorted(response.get_json(), key=lambda x: x["id"])
    last_id = budget[len(budget) - 1]["id"]

    mock_data = app.budget
    mock_data["amount"] += 525

    updatedRes = client.put(f"/api/budget/{last_id}", json=mock_data)
    assert updatedRes.status_code == 200

    data = updatedRes.get_json()[0]
    assert data["email"] == mock_email


""" DELETE """


def test_delete_budget(client):
    mock_email = app.budget["email"]
    res = client.get(f"/api/users/{mock_email}")
    id = res.get_json()[0]["userid"]

    response = client.get(f"/api/budget/{id}")
    assert response.status_code == 200
    budget = sorted(response.get_json(), key=lambda x: x["id"])
    last_id = budget[len(budget) - 1]["id"]

    deletedRes = client.delete(f"/api/budget/{last_id}")
    assert deletedRes.status_code == 200

    budget = deletedRes.get_json()[0]
    assert budget["email"] == mock_email
