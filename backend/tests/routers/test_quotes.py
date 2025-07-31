import json
from app.core.redis_client import redis_client

API_ENDPOINT = "/api/v1/quote"


def test_read_quote_api_returns_200_on_cache_miss(client, mocker):
    """
    Test that the /api/quote endpoint returns a 200 status code when cache is empty.
    """
    mocker.patch.object(redis_client, "srandmember", return_value=None)

    response = client.get(API_ENDPOINT)

    assert response.status_code == 200
    redis_client.srandmember.assert_called_once_with("quotes")


def test_read_quote_api_returns_json_on_cache_miss(client, mocker):
    """
    Test that the /api/quote endpoint returns a JSON response when cache is empty.
    """
    mocker.patch.object(redis_client, "srandmember", return_value=None)

    response = client.get(API_ENDPOINT)

    assert response.headers["Content-Type"] == "application/json"
    redis_client.srandmember.assert_called_once_with("quotes")


def test_read_quote_api_returns_correct_structure_on_cache_miss(client, mocker):
    """
    Test that the /api/quote endpoint returns a JSON response
    with the correct structure when cache is empty.
    """
    mocker.patch.object(redis_client, "srandmember", return_value=None)

    response = client.get(API_ENDPOINT)
    data = response.json()
    assert "author" in data
    assert "text" in data
    redis_client.srandmember.assert_called_once_with("quotes")


def test_get_quote_with_cache_hit(client, mocker):
    """
    Test that Get /quote returns a quote from Redis when the cache is hit.
    """
    cached_quote = {
        "author": "Cached Author",
        "text": "A quote from Redis.",
    }
    cached_quote_json_string = json.dumps(cached_quote)

    mocker.patch.object(
        redis_client, "srandmember", return_value=cached_quote_json_string
    )

    response = client.get(API_ENDPOINT)

    assert response.status_code == 200
    assert response.json() == cached_quote
    redis_client.srandmember.assert_called_once_with("quotes")
