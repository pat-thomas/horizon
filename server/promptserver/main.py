from flask import Flask
import datastore
#from datastore import get_prompt, add_prompt, update_prompt
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello from Flask'

@app.get('/api/user/<username>')
def get_user_profile(username):
    return f'{username}\'s profile'

@app.get('/api/prompt/<prompt_id>')
def get_prompt(prompt_id):
    prompt_data = datastore.db_get_prompt(prompt_id)
    if prompt_data: return prompt_data
    return({
        "message": "prompt not found"
    }, 404)

if __name__ == '__main__':
    app.run()
