import boto3
import json
import os

from app.core.kb_loader import FALLBACK_QUOTES

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
MODEL_ID = os.getenv("MODEL_ID", "anthropic.claude-v2")


def _build_prompt() -> str:
    """
    Builds the prompt using the fallback quotes.
    """
    example_quotes_str = "\n".join(
        [f'- "{q["text"]}" from {q["author"]}' for q in FALLBACK_QUOTES]
    )

    prompt_template = f"""
    You are a creative assistant specializing in philosophy and literature.
    Your task is to generate original and inspiring quotes that maintain a
    high standard of quality.

    Based on the style, tone, and authors of the examples below:

    ---
    Reference Examples:
    {example_quotes_str}
    ---

    Please generate for me a list of 10 new, original quotes that follow the same
    standard of quality and inspiration as the examples.
    Each quote must be accompanied by a clearly fictitious author name with a
    philosophical or poetic sound, avoiding the names of real people or known
    historical figures.

    Format the output EXCLUSIVELY as a valid JSON list of objects, where each object
    has a "text" and an "author" key.
    """

    return prompt_template


def generate_ai_quotes() -> list[dict]:
    """
    Connects to AWS Bedrock and generates a list of original quotes
    based on a knowledge base of quotes, returning a list of dicts.
    """
    bedrock_client = boto3.client(
        service_name="bedrock-runtime", region_name=AWS_REGION
    )

    prompt = _build_prompt()

    body = json.dumps(
        {
            "prompt": f"\n\nHuman: {prompt}\n\nAssistant:",
            "max_tokens_to_sample": 1024,
            "temperature": 0.7,
            "top_p": 0.9,
        }
    )

    response = bedrock_client.invoke_model(
        body=body,
        modelId=MODEL_ID,
        accept="application/json",
        contentType="application/json",
    )

    response_body = json.loads(response["body"].read())
    completion_json_str = response_body.get("completion", "[]")

    try:
        quotes = json.loads(completion_json_str)
    except json.JSONDecodeError:
        quotes = []

    return quotes
