import random
from fastapi import APIRouter, Request
from app.dependencies import limiter
from app.config import QUOTES_RATE_LIMIT

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
    return random.choice(quotes)
