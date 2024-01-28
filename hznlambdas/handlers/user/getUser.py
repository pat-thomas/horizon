import json
# import boto3
import requests

# dynamodb = boto3.client('dynamodb')

def get_random_data(data_type):
    return requests.get(f"https://random-data-api.com/api/v2/{data_type}?size=5&is_json=true")

def lambda_handler(event, context):
    body = {
        "message": "Go Serverless v3.0! Your function executed successfully!",
        "input": event,
        "function_name": context.function_name
    }

    random_data = get_random_data("beers")

    response = {
        "statusCode": 200,
        "body": json.dumps(body),
        "data": random_data.json()
    }

    return response
