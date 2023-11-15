import axios from 'axios'

const apiHost = 'http://localhost:5173/api/'
const apiPath = (route) => {
  return apiHost + route
}

export const httpGetPromptList = async (thunkApi) => {
  const response = await axios.get(apiPath('prompts'))
  return { ...response.data }
}

export const httpGetPromptById = async (promptId: string, thunkAPI) => {
  const path = `http://localhost:5173/api/prompts/${promptId}`
  const response = await axios.get(path)
  return { ...response.data , id: promptId }
}
