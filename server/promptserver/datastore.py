import os
import json

def db_get_prompt(prompt_id):
    prompt_path = f"data/prompts/{prompt_id}.json"
    print (f"will attempt to open prompt at path {prompt_path}")
    if not os.path.isfile(prompt_path): return

    f = open(prompt_path, "r")
    data = f.read()
    parsed_data = json.loads(data)
    return parsed_data
