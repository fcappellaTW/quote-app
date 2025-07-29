import os
import boto3
from dotenv import load_dotenv
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError

load_dotenv()

print("Trying to connect to Bedrock...")

try:
    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_region = os.getenv("AWS_REGION")

    if not all([aws_access_key_id, aws_secret_access_key, aws_region]):
        raise ValueError(
            "AWS credentials are not configured correctly. Verify the .env file."
        )

    bedrock_client = boto3.client(
        service_name="bedrock",
        region_name=aws_region,
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
    )

    print("Searching for available models...")

    response = bedrock_client.list_foundation_models()
    models = [model["modelName"] for model in response["modelSummaries"]]

    print("✅ Successfully connected to Bedrock!")
    print(f"Found {len(models)} models on the region {aws_region}")

    print("Available models:")

    for model_name in models[:5]:
        print(f"- {model_name}")


except (NoCredentialsError, PartialCredentialsError):
    print("❌ Credentials Error: The AWS credentials are not configured correctly.")
    print(
        "Please check if the environment variables or the .env file is "
        "configured correctly."
    )
except ClientError as e:
    if e.response["Error"]["Code"] == "AccessDeniedException":
        print("❌ Permission Error: Access Denied.")
        print(
            "Please check if the IAM user 'quote-app-bedrock-user' "
            "has the 'BedrockFullAccess' policy attached."
        )
    else:
        print(f"❌ Unexpected error: {e}")
except Exception as e:
    print(f"❌ An unexpected error occurred: {e}")
