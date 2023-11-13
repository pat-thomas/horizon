import os
import glob
import json

def db_get_prompt(prompt_id):
    prompt_path = f"./data/prompts/{prompt_id}.json"
    if not os.path.isfile(prompt_path): return

    f = open(prompt_path, "r")
    data = f.read()
    parsed_data = json.loads(data)
    return parsed_data

def db_list_prompts():
    prompt_ids = []
    glob_path = "./data/prompts/*.json"
    for json_file in glob.glob("./data/prompts/*.json"):
        prompt_ids.append(os.path.basename(json_file).split(".json")[0])
    prompt_ids.sort()
    return prompt_ids
