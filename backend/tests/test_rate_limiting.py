from fastapi import Request
from fastapi.testclient import TestClient
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.main import app

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter


@app.get("/test-rate-limit")
@limiter.limit("2/second")
async def _rate_limit_endpoint(request: Request):
    print(request)
    return {"message": "ok"}


client = TestClient(app)


def test_rate_limit_blocks_after_exceeding_limit():
    """
    Verify that the rate limit blocks after exceeding the limit.
    """
    limit = 2
    for i in range(limit):
        response = client.get("/test-rate-limit")
        assert response.status_code == 200

    response = client.get("/test-rate-limit")
    assert response.status_code == 429
