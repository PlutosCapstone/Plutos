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
        app.user = {
            "first_name": "Lisa",
            "middle_name": "Destroyed",
            "last_name": "My Money",
            "email": "amd@dead.com",
            "dob": "2025-02-02T22:40:27.128Z",
            "sex": "female",
            "occupation": "Unemployed this cycle in the economy D:",
        }
        yield client


""" POST """


def test_create_user(client):
    mock_data = app.user
    # Cleanup by test_delete_user()
    response = client.post("/api/users/", json=mock_data)
    print(response.status_code)
    assert response.status_code == 201


""" GET """


def test_get_user_exists(client):
    mock_email = app.user["email"]

    response = client.get(f"/api/users/{mock_email}")
    assert response.status_code == 200

    user = response.get_json()[0]
    assert user["email"] == mock_email


""" PUT """


def test_update_user(client):
    mock_data = app.user
    mock_data["middle_name"] = "goat"

    response = client.put(f'/api/users/{app.user["email"]}', json=mock_data)
    assert response.status_code == 200

    data = response.get_json()[0]
    assert data["email"] == app.user["email"]


""" DELETE """


def test_delete_user(client):
    response = client.delete(f'/api/users/{app.user["email"]}')
    assert response.status_code == 200

    data = response.get_json()[0]
    assert data["email"] == app.user["email"]
