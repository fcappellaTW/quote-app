import json

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


def test_get_quote_with_cache_hit(client, mocker):
    """
    Test that Get /quote returns a quote from Redis when the cache is hit.
    """
    cached_quote = {
        "author": "Cached Author",
        "text": "A quote from Redis.",
    }
    cached_quote_json_string = json.dumps(cached_quote)
    mock_redis = mocker.patch('app.routers.quotes.redis_client')
    mock_redis.get.return_value = cached_quote_json_string

    response = client.get(API_ENDPOINT)

    assert response.status_code == 200
    assert response.json() == cached_quote
    mock_redis.lpop.assert_called_once_with("quotes")
