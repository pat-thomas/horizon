import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { PromptPart } from "../../app/types"
import {
  httpGetPromptById ,
  httpGetRandomPrompt,
  httpSavePrompt
} from "../../apiClient"

interface LoadedPrompt extends Prompt {
  id: string
}

export interface PromptBuilderState {
  parts: Prompt,
  loadedPrompts: [LoadedPrompt]
}

const nextColor = ({r, g, b}) => {
  return {
    r: r+30,
    g: g-25,
    b: b+5
  }
}

export const defaultRgb = {
  r: 30,
  g: 100,
  b: 120
}

const colors = (n) => {
  let colorsArr = [defaultRgb]
  for (var i = 0; i < n; i++) {
    const prevColor = colorsArr[colorsArr.length-1]
    colorsArr.push(nextColor(prevColor))
  }
  return colorsArr
};

const samplePrompt0 = {
  parts: [
    {
      text: 'a field with a single tree and colorful flowers, a sidewalk leads to the tree and the tree has a door and windows on it, a city floats above the clouds',
      weight: 1,
      backgroundColor: defaultRgb
    },
    {
      text: 'lofi minimal visual style , 3d graphics , low resolution',
      weight: 1.2,
      backgroundColor: nextColor(defaultRgb)
    }
  ]
}

const samplePrompt1 = {
  parts: [
    {
      text: 'face , minimal , visual style of Joan Miro and Salvador Dali',
      weight: 1,
      backgroundColor: defaultRgb
    },
    {
      text: 'flower , stylized , pixelated',
      weight: 1,
      backgroundColor: nextColor(defaultRgb)
    }
  ]
}

const samplePrompt2 = {
  parts: [
    {
      text: 'animals dancing , magazine photography',
      weight: 1,
      backgroundColor: defaultRgb
    },
    {
      text: 'cardboard cutout of the universe',
      weight: 0.5,
      backgroundColor: nextColor(defaultRgb)
    }
  ]
}

const initialSettings = {weightDifference: 0.25, style: 250, chaos: 0}

const initialAppHistory = [
  {
    name: 'loadPrompt',
    data: { ...samplePrompt0, id: 'sample0'}
  },
  {
    name: 'updateSettings',
    data: initialSettings
  },
  {
    name: 'setActivePrompt',
    data: samplePrompt0
  },

]

const doLoadPrompt = (state, data) => {
  let currPrompts = state.loadedPrompts
  const promptId = data.id
  let match = false

  if (currPrompts) {
    currPrompts.forEach((p) => {
      if (p.id === promptId) {
        p = action.payload
        match = true
      }
    })
  }

  if (match) {
    return state
  }
  if (state.loadedPrompts) {
    state.loadedPrompts = [...state.loadedPrompts , data]
  } else {
    state.loadedPrompts = [data]
  }
  return state
}

const doUpdateSettings = (state, newSettings) => {
  state.settings = newSettings
  return state
}

const doSetActivePrompt = (state, data) => {
  state.activePrompt = data
  return state
}

const applyHistoryUpdate = (state, actionRollup) => {
  const {
    name,
    data
  } = actionRollup
  let newState
  switch(name) {
    case 'loadPrompt':
      newState = doLoadPrompt(state, data)
      break
    case 'updateSettings':
      newState = doUpdateSettings(state, data)
      break
    case 'setActivePrompt':
      newState = doSetActivePrompt(state, data)
      break
    default:
  }
  return newState
}

const generateStateFromHistory = (appHistory) => {
  const stateFromHistory = appHistory.reduce((stateAcc, historyObj) => {
    stateAcc = applyHistoryUpdate(stateAcc, historyObj)
    return stateAcc
  }, {})
  return stateFromHistory
}

const updateHistory = (state, actionRollup) => {
  state.appHistory.push(actionRollup)
}

const initialState: PromptBuilderState = {
  ...generateStateFromHistory(initialAppHistory),
  appHistory: initialAppHistory
}

export const getPromptById = createAsyncThunk(
  'prompt/getPromptById',
  httpGetPromptById
)

export const getRandomPrompt = createAsyncThunk(
  'prompt/getRandomPrompt',
  httpGetRandomPrompt
)

export const savePrompt = createAsyncThunk(
  'prompt/savePrompt',
  httpSavePrompt
)

const doAddPart = (state) => {
  let lastPart = state.activePrompt.parts[state.activePrompt.parts.length-1];
  lastPart = lastPart || initialState.activePrompt.parts[0];
  const newPrompt = {
    index: state.activePrompt.parts.length+1,
    text: lastPart.text,
    weight: lastPart.weight,
    backgroundColor: nextColor(lastPart.backgroundColor || defaultRgb)
  }
  state.activePrompt.parts = [...state.activePrompt.parts, newPrompt]
  return newPrompt
}

// "doers": which are functions that serve 1 purpose:
// 1) to update the application state
const doGetRandomPrompt = (state, action) => {
  const {
    promptIndex,
    data
  } = action.payload
  const randomPrompt = data.prompt_data.prompt
  state.activePrompt.parts[promptIndex].text = randomPrompt
  return state
}

// "handlers": which are functions that serve 2 purposes:
// 1) add an entry to the history tape
// 2) perform the side effect of updating the application state
const handleGetRandomPrompt = (state, action) => {
  updateHistory(state, {
    name: 'getRandomPrompt.fulfilled',
    data: action
  })

  return doGetRandomPrompt(state, action)
}

export const promptBuilderSlice = createSlice({
  name: "promptBuilder",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateSettingWeightDifference: (state, action) => {
      const newWeightDifference = action.payload
      const newSettings = doUpdateSettings(state, {
        ...state.settings,
        weightDifference: newWeightDifference
      }).settings
      updateHistory(state, {
        name: 'updateSettings',
        data: newSettings
      })
    },
    updateSettingStyle: (state, action) => {
      state.settings.style = action.payload
    },
    updateSettingChaos: (state, action) => {
      state.settings.chaos = action.payload
    },
    addPart: (state) => {
      const newPrompt = doAddPart(state)
      updateHistory(state, {
        name: 'addPart',
        data: newPrompt
      })
    },
    removePart: (state, action) => {
      const currParts = state.activePrompt.parts
      const index = action.payload.index
      state.activePrompt.parts = [
        ...currParts.slice(0, index),
        ...currParts.slice(index+1, currParts.length)
      ]
    },
    updatePartText: (state, action) => {
      const {
        text,
        index
      } = action.payload
      state.activePrompt.parts[index].text = text
    },
    incrementPartWeight: (state, action) => {
      const weightDifference = Number(state.settings.weightDifference)
      const index = action.payload.index
      const part = state.activePrompt.parts[index]
      state.activePrompt.parts[index].weight += weightDifference
    },
    decrementPartWeight: (state, action) => {
      const weightDifference = Number(state.settings.weightDifference)
      const index = action.payload.index
      const part = state.activePrompt.parts[index]
      state.activePrompt.parts[index].weight -= weightDifference
    },
    useLoadedPromptToSetBuilder: (state, action) => {
      const promptId = action.payload
      const matchingLoadedPrompts = state.loadedPrompts.filter((p) => {
        return p.id === promptId
      })
      const promptToUse = matchingLoadedPrompts[0]
      updateHistory(state, {
        name: 'updateSettings',
        data: promptToUse
      })
      // there should never be more than one match anyway, if there is, just use the first
      state.activePrompt = promptToUse
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPromptById.pending, (state) => {
      return state
      // state.loading = true
    })
    builder.addCase(getPromptById.fulfilled, (state, action) => {
      const loadedPrompt = doLoadPrompt(state, action.payload)
      updateHistory(state, {
        name: 'loadPrompt',
        data: loadedPrompt
      })
      return state
    })
    builder.addCase(getPromptById.rejected, (state, action) => {
      // state.loading = false
      console.error('error fetching prompt from server')
    })

    builder.addCase(getRandomPrompt.pending, (state) => {
      return state
    })
    builder.addCase(getRandomPrompt.fulfilled, (state, action) => {
      return handleGetRandomPrompt(state, action)
    })
    builder.addCase(getRandomPrompt.rejected, (state, action) => {
      console.error('error generating prompt')
      return state
    })
  }
})

export const {
  addPart,
  removePart,
  updatePartText,
  incrementPartWeight,
  decrementPartWeight,
  updateSettingWeightDifference,
  updateSettingStyle,
  updateSettingChaos,
  useLoadedPromptToSetBuilder
} = promptBuilderSlice.actions

export default promptBuilderSlice.reducer
