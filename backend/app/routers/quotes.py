import random
from fastapi import APIRouter

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
    {"author": "Mark Twain", "text": "The secret of getting ahead is getting started."},
]


@router.get("/quote", tags=["quotes"])
def get_random_quote():
    return random.choice(quotes)
