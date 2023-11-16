from flask import Flask
import datastore
import api_client
#from datastore import get_prompt, add_prompt, update_prompt
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello from Flask'

@app.get('/api/user/<username>')
def get_user_profile(username):
    return f'{username}\'s profile'

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

if __name__ == '__main__':
    app.run()
