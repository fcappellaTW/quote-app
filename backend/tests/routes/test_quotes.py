from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_quote_api_returns_200():
    """Test that the /api/quote endpoint returns a 200 status code"""
    response = client.get("/api/quote")
    assert response.status_code == 200


def test_read_quote_api_returns_json():
    """Test that the /api/quote endpoint returns a JSON response"""
    response = client.get("/api/quote")
    assert response.headers["Content-Type"] == "application/json"


def test_read_quote_api_returns_correct_structure():
    """Test that the /api/quote endpoint returns a JSON response with the
    correct structure"""
    response = client.get("/api/quote")
    data = response.json()
    assert "author" in data
    assert "text" in data
