from app.config import QUOTES_RATE_LIMIT

API_ENDPOINT = "/api/v1/quote"


def test_rate_limit_blocks_after_exceeding_limit(client):
    """
    Verify that the rate limit blocks after exceeding the limit.
    """
    limit = int(QUOTES_RATE_LIMIT.split("/")[0])
    for i in range(limit):
        response = client.get(API_ENDPOINT)
        assert response.status_code == 200

    response = client.get(API_ENDPOINT)
    assert response.status_code == 429
