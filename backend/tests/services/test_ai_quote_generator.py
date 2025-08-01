import json
import boto3
from app.services import ai_quote_generator

def test_generate_quote_with_quotes_successfully(mocker):
    """
    Tests that the AI quote generator can correctly call Bedrock
    and parse a successful response.

    """
    mock_bedrock_client = mocker.patch('boto3.client').return_value
    fake_llm_response = {
        "body": json.dumps({
            "completion": "Phrase 1 of test.\nPhrase 2 of test.\nPhrase 3 of test.",
            "stop_reason": "stop_sequence"
        })
    }

    mock_body = mocker.MagicMock()
    mock_body.read.return_value = fake_llm_response["body"]
    mock_bedrock_client.invoke_model.return_value = {"body": mock_body}

    generated_quotes = ai_quote_generator.generate_ai_quotes()

    assert isinstance(generated_quotes, list)
    assert len(generated_quotes) == 3
    assert generated_quotes[0] == "Phrase 1 of test."
    assert "Phrase 2" in generated_quotes[1]
    assert "Phrase 3" in generated_quotes[2]

    mock_bedrock_client.invoke_model.assert_called_once()