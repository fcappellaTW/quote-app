import random
import json
from fastapi import APIRouter, Request
from app.dependencies import limiter
from app.config import QUOTES_RATE_LIMIT
from app.core.redis_client import redis_client

router = APIRouter()

quotes = [
    {
        "author": "Albert Einstein",
        "text": "Strive not to be a success, but rather to be of value.",
    },
    {
        "author": "Steve Jobs",
        "text": "Your time is limited, so don't waste it living someone else's life.",
    },
    {
        "author": "Mark Twain",
        "text": "The secret of getting ahead is getting started.",
    },
]


@router.get("/quote", tags=["quotes"])
@limiter.limit(QUOTES_RATE_LIMIT)
def get_random_quote(request: Request):
    """
    Returns a single random quote from the static list.
    This endpoint is rate-limited.
    """
    cached_quote_string = redis_client.lpop("quotes")

    if cached_quote_string:
        return json.loads(cached_quote_string)

    return random.choice(quotes)
