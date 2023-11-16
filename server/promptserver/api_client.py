import requests

# According to https://random-data-api.com/documentation , these are all of the currently supported data types.
valid_data_types = [
    "users",
    "addresses",
    "beers",
    "appliances",
    "banks",
    "blood_types",
    "credit_cards"
]

def get_random_data(data_type):
    if data_type not in valid_data_types:
        return
    else:
        random_data_from_api = requests.get(f"https://random-data-api.com/api/v2/{data_type}?size=5&is_json=true")
        return random_data_from_api.json()
