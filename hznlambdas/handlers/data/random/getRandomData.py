import json
# import boto3
import requests

# dynamodb = boto3.client('dynamodb')

def get_random_data(data_type):
    return requests.get(f"https://random-data-api.com/api/v2/{data_type}?size=5&is_json=true")

def lambda_handler(event, context):
    response = {
        "statusCode": 200,
        "body": json.dumps({
            "data": get_random_data("beers").json()
        })
    }
    some_function()

    return response

