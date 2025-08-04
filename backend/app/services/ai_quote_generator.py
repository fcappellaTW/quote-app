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

    Please generate for me a list of 10 new, **completely new and original** quotes
    that follow the same standard of quality and inspiration as the examples.
    **It is crucial that these quotes are not famous or existing phrases.**
    Each quote must be accompanied by a clearly fictitious author name with a
    philosophical or poetic sound, avoiding the names of real people or known
    historical figures.

    IMPORTANT RULES:
    1. The quotes must be 100% original, created by you now.
    2. Do not use quotes from real philosophers (e.g., Plato, Aristotle, Seneca).
    3. The authors' names must be invented (e.g., "Kyran of Ephusia", "Zhan Lu of Qin").
    4. The response must be **ONLY** a JSON list of objects, without any introductory
    text.

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

    try:
        response = bedrock_client.invoke_model(
            body=body,
            modelId=MODEL_ID,
            accept="application/json",
            contentType="application/json",
        )

        response_body = json.loads(response["body"].read())
        completion_json_str = response_body.get("completion", "")

        start_index = completion_json_str.find("[")
        end_index = completion_json_str.rfind("]")

        if start_index != -1 and end_index != -1:
            json_quotes = completion_json_str[start_index : end_index + 1]
            try:
                quotes = json.loads(json_quotes)

                for quote in quotes:
                    if "text" in quote:
                        quote["text"] = quote.pop("text")

                return quotes
            except json.JSONDecodeError:
                print(f"Error parsing JSON response from Bedrock: {json_quotes}")
                return []
        else:
            return []

    except Exception as e:
        print(f"Error calling Bedrock API: {e}")
        return []
