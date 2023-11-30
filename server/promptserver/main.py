from flask import Flask
import datastore
import api_client
import random

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello from Flask'

@app.get('/api/user/<username>')
def get_user_profile(username):
    return f'{username}\'s profile'

@app.get('/api/tours/<tour_id>')
def get_tour(tour_id):
    tour_data = datastore.db_get_tour(tour_id)
    if tour_data: return tour_data
    return({
        "message": "tour not found"
    }, 404)

@app.get('/api/prompts/<prompt_id>')
def get_prompt(prompt_id):
    prompt_data = datastore.db_get_prompt(prompt_id)
    if prompt_data: return prompt_data
    return({
        "message": "prompt not found"
    }, 404)

@app.get('/api/prompts')
def list_prompts():
    prompt_list = datastore.db_list_prompts()
    if prompt_list: return({
        "prompt_ids": prompt_list
    })
    return({
        "message": "prompts not found"
    }, 404)

@app.get('/api/data/random/<data_type>')
def get_random_data(data_type):
    random_data = api_client.get_random_data(data_type)
    if random_data: return({
        "data": random_data
    })
    return({
        "message": f"invalid data type {data_type} requested"
    }, 400)


def make_prompt_from_random_data(data_type, data):
    if data_type == "beers":
        print(data)
        brands = list(map(lambda d: d["brand"], data))
        random_brand = random.choice(brands)
        styles = list(map(lambda d: d["style"], data))
        random_style = random.choice(styles)
        names = list(map(lambda d: d["name"], data))
        random_name = random.choice(names)
        return {
            "prompt": f"a glass of {random_brand} beer , {random_style} style beer , beer with name '{random_name}' on label"
        }
    elif data_type == "users":
        print("users!!!")
    else:
        print("no match.")
        return data

@app.get('/api/data/random/<data_type>/prompt')
def get_random_prompt(data_type):
    random_data = api_client.get_random_data(data_type)
    if random_data:
        prompt_data = make_prompt_from_random_data(data_type, random_data)
        return({
            "prompt_data": prompt_data
        })
    return({
        "message": f"invalid data type {data_type} requested"
    }, 400)
    return

if __name__ == '__main__':
    app.run()
