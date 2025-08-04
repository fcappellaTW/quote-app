import random
import json
from fastapi import APIRouter, Request
from app.dependencies import limiter
from app.config import QUOTES_RATE_LIMIT, REDIS_QUOTE_KEY
from app.core.redis_client import redis_client
from app.core.kb_loader import FALLBACK_QUOTES

router = APIRouter()


@router.get("/quote", tags=["quotes"])
@limiter.limit(QUOTES_RATE_LIMIT)
def get_random_quote(request: Request):
    """
    Returns a single random quote from the static list.
    This endpoint is rate-limited.
    """
    cached_quote_string = redis_client.srandmember(REDIS_QUOTE_KEY)

    if cached_quote_string:
        return json.loads(cached_quote_string)

    return random.choice(FALLBACK_QUOTES)
