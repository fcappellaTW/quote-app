import json
import boto3 # noqa: F401
from app.services import ai_quote_generator

def test_generate_quote_with_quotes_successfully(mocker):
    """
    Test the full flow of the AI quote generator:
    1. Mocks the knowledge base to avoid file I/O.
    2. Mocks the Boto3 client to avoid network calls.
    3. Asserts that the structured JSON response from the LLM is parsed correctly.

    """
    mocker.patch(
        "app.services.ai_quote_generator.FALLBACK_QUOTES",
        [{"text": "Example quote", "author": "Author Example"}]
    )

    mock_bedrock_client = mocker.patch("boto3.client").return_value

    fake_llm_completion = json.dumps([
        {"quote": "Example quote 1", "author": "Author Example 1"},
        {"quote": "Example quote 2", "author": "Author Example 2"},
    ])

    fake_bedrock_response = {
        "body": json.dumps({"completion": fake_llm_completion})
    }

    mock_body = mocker.MagicMock()
    mock_body.read.return_value = fake_bedrock_response["body"]
    mock_bedrock_client.invoke_model.return_value = {"body": mock_body}

    generated_quotes = ai_quote_generator.generate_ai_quotes()

    assert isinstance(generated_quotes, list)
    assert len(generated_quotes) == 3

    first_quote = generated_quotes[0]
    assert isinstance(first_quote, dict)
    assert "quote" in first_quote
    assert "author" in first_quote
    assert first_quote["quote"] == "Example quote 1"
    assert first_quote["author"] == "Author Example 1"

    mock_bedrock_client.invoke_model.assert_called_once()