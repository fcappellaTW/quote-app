
from app.workers.cache_worker import populate_cache_if_needed


def test_populate_cache_calls_ai_service_when_quote_count_is_low(mocker):
    """
    Given: Number of quotes in the cache is below the threshold.
    When: The cache worker is called.
    Then: The AI service is called to generate quotes.
    """
    mock_redis_client = mocker.patch("app.core.redis_client")
    mock_redis_client.llen.return_value = 2
    MINIMUM_QUOTE_COUNT = 5

    mock_ai_quote_service = mocker.patch("app.workers.cache_worker.generate_ai_quotes")
    mock_ai_quote_service.return_value = [
        {"quote": "TDD is awesome.", "author": "A wise developer"}
    ]

    populate_cache_if_needed(minimum_count=MINIMUM_QUOTE_COUNT)
    mock_ai_quote_service.assert_called_once()
