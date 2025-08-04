import json
from app.workers.cache_worker import populate_cache_if_needed
from app.config import REDIS_QUOTE_KEY


def test_worker_generates_and_saves_new_quotes_when_cache_is_low(mocker):
    """
    Given: Number of quotes in the cache is below the threshold.
    When: The cache worker is called.
    Then: The AI service is called to generate quotes and the quotes are saved
    in the cache.
    """
    mock_redis_client = mocker.patch("app.workers.cache_worker.redis_client")
    mock_redis_client.scard.return_value = 2
    MINIMUM_QUOTE_COUNT = 5

    mock_ai_quote_service = mocker.patch("app.workers.cache_worker.generate_ai_quotes")
    fake_quotes = [
        {"text": "TDD is awesome.", "author": "A wise developer"},
        {
            "text": "Using the right data structure matters.",
            "author": "A wise developer",
        },
    ]
    mock_ai_quote_service.return_value = fake_quotes

    populate_cache_if_needed(minimum_count=MINIMUM_QUOTE_COUNT)
    mock_ai_quote_service.assert_called_once()

    serialized_quotes = [json.dumps(q) for q in fake_quotes]
    mock_redis_client.sadd.assert_called_once_with(REDIS_QUOTE_KEY, *serialized_quotes)


def test_worker_does_nothing_when_cache_is_above_threshold(mocker):
    """
    Given: Number of quotes in the cache is above the threshold.
    When: The cache worker is called.
    Then: The AI service is not called and the cache is not updated.
    """
    mock_redis_client = mocker.patch("app.workers.cache_worker.redis_client")
    mock_redis_client.scard.return_value = 20
    MINIMUM_QUOTE_COUNT = 5

    mock_ai_quote_service = mocker.patch("app.workers.cache_worker.generate_ai_quotes")

    populate_cache_if_needed(minimum_count=MINIMUM_QUOTE_COUNT)
    mock_ai_quote_service.assert_not_called()
    mock_redis_client.sadd.assert_not_called()
