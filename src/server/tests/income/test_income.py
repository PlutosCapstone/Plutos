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
        app.incomes = {
            "title": "Test Data",
            "amount": 100,
            "recurring": False,
            "frequency": None,
            "email": "hi@email.com",
        }
        yield client


""" GET """


def test_get_incomes_valid_user(client):
    mock_email = app.incomes["email"]

    response = client.get(f"/api/incomes/{mock_email}")
    assert response.status_code == 200

    income_list = response.get_json()
    for income in income_list:
        assert income["email"] == mock_email


""" GET """


def test_get_incomes_invalid_user(client):
    test_email = "nonexistentuser@test.com"

    client.get(f"/api/incomes/{test_email}")
    """ To be implemented """
    # assert response.status_code == 404


""" POST """


def test_create_income(client):
    mock_data = app.incomes
    # Cleanup by test_delete_income()
    response = client.post("/api/incomes/", json=mock_data)
    print(response.status_code)
    assert response.status_code == 201


""" PUT """


def test_update_income(client):
    res = client.get(f'/api/incomes/{app.incomes["email"]}').get_json()
    id = res[len(res) - 1]["id"]

    mock_data = res[len(res) - 1]
    mock_data["amount"] += 100

    response = client.put(f"/api/incomes/{id}", json=mock_data)
    assert response.status_code == 200

    data = response.get_json()[0]
    assert data["id"] == id


""" DELETE """


def test_delete_income(client):
    res = client.get(f'/api/incomes/{app.incomes["email"]}').get_json()
    id = res[len(res) - 1]["id"]

    response = client.delete(f"/api/incomes/{id}")
    assert response.status_code == 200

    data = response.get_json()[0]
    assert data["id"] == id
