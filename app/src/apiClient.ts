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
  const response = await axios.get(apiPath(`prompts/${promptId}`))
  return { ...response.data , id: promptId }
}

export const httpGetRandomData = async (dataType: string, thunkAPI) => {
  const response = await axios.get(apiPath(`data/random/${dataType}`))
  return { data: response.data , dataType: dataType }
}

export const httpGetRandomPrompt = async (dataType: string, promptIndex, thunkAPI) => {
  const response = await axios.get(apiPath(`data/random/${dataType}/prompt`))
  return { data: response.data , dataType: dataType , promptIndex: promptIndex }
}
