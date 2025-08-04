import pytest
from app.services.ai_quote_generator import generate_ai_quotes


@pytest.mark.integration
def test_bedrock_api_call_returns_valid_structure():
    """
    Performs a REAL API call to AWS Bedrock to ensure the end-to-end
    integration is working and the response structure is as expected.
    This test is slow and costs money.
    """
    generated_quotes = generate_ai_quotes()

    assert isinstance(generated_quotes, list)

    if not generated_quotes:
        print("Warning: AI service returned an empty list in integration test.")
        return

    first_quote = generated_quotes[0]
    assert isinstance(first_quote, dict)
    assert "text" in first_quote
    assert "author" in first_quote
    assert isinstance(first_quote["text"], str)
    assert isinstance(first_quote["author"], str)
    assert len(first_quote["text"]) > 0
