API_ENDPOINT = "/api/v1/quote"


def test_read_quote_api_returns_200(client):
    """Test that the /api/quote endpoint returns a 200 status code"""
    response = client.get(API_ENDPOINT)
    assert response.status_code == 200


def test_read_quote_api_returns_json(client):
    """Test that the /api/quote endpoint returns a JSON response"""
    response = client.get(API_ENDPOINT)
    assert response.headers["Content-Type"] == "application/json"


def test_read_quote_api_returns_correct_structure(client):
    """
    Test that the /api/quote endpoint returns a JSON response
    with the correct structure.
    """
    response = client.get(API_ENDPOINT)
    data = response.json()
    assert "author" in data
    assert "text" in data
