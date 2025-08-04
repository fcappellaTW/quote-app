import os

QUOTES_RATE_LIMIT = "2/second"
REDIS_QUOTE_KEY = os.getenv("REDIS_QUOTE_KEY", "quotes")
