import json
from app.services.ai_quote_generator import generate_ai_quotes
from app.core.redis_client import redis_client
from app.config import REDIS_QUOTE_KEY


def populate_cache_if_needed(minimum_count: int = 10):
    """
    Checks the number of quotes in the cache and, if it is below
    the minimum, invokes the AI service to generate new quotes and
    stores them in the cache.
    """
    current_count = redis_client.scard(REDIS_QUOTE_KEY)

    if current_count < minimum_count:
        new_quotes = generate_ai_quotes()

        if new_quotes:
            serialized_quotes = [json.dumps(q) for q in new_quotes]
            redis_client.sadd(REDIS_QUOTE_KEY, *serialized_quotes)
