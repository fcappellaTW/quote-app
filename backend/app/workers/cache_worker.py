import os
from app.services.ai_quote_generator import generate_ai_quotes
from app.core.redis_client import redis_client

REDIS_QUOTE_KEY = os.getenv("REDIS_QUOTE_KEY", "quotes")


def populate_cache_if_needed(minimum_count: int = 10):
    """
    Checks the number of quotes in the cache and, if it is below
    the minimum, invokes the AI service to generate new quotes and
    stores them in the cache.
    """
    current_count = redis_client.llen(REDIS_QUOTE_KEY)

    if current_count < minimum_count:
        generate_ai_quotes()
