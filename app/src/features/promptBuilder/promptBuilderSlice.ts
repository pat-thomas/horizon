import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { PromptPart } from "../../app/types"
import axios from 'axios'

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

const samplePrompt1 = {
  parts: [
    {
      text: 'face , minimal',
      weight: 1,
      backgroundColor: defaultRgb
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

const initialState: PromptBuilderState = {
  activePrompt: samplePrompt1,
  settings: {
    weightDifference: 0.25,
    style: 250,
    chaos: 0
  },
  loadedPrompts: [
    { ...samplePrompt1, id: 'sample1' },
    { ...samplePrompt2, id: 'sample2' }
  ]
}

export const getPromptById = createAsyncThunk(
  'prompt/getPromptById',
  async (promptId: string, thunkAPI) => {
    const path = `http://localhost:5173/api/prompts/${promptId}`
    console.log('about to call path', path)
    const response = await axios.get(path)
    return { ...response.data , id: promptId }
  }
)

export const promptBuilderSlice = createSlice({
  name: "promptBuilder",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateSettingWeightDifference: (state, action) => {
      state.settings.weightDifference = action.payload
    },
    updateSettingStyle: (state, action) => {
      state.settings.style = action.payload
    },
    updateSettingChaos: (state, action) => {
      state.settings.chaos = action.payload
    },
    addPart: (state) => {
      let lastPart = state.activePrompt.parts[state.activePrompt.parts.length-1];
      lastPart = lastPart || initialState.activePrompt.parts[0];
      state.activePrompt.parts = [...state.activePrompt.parts,
        {
          index: state.activePrompt.parts.length+1,
          text: lastPart.text,
          weight: lastPart.weight,
          backgroundColor: nextColor(lastPart.backgroundColor || defaultRgb)
        }
      ];
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
      // there should never be more than one match anyway, if there is, just use the first
      state.activePrompt = matchingLoadedPrompts[0]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPromptById.pending, (state) => {
      console.log('loading')
      return state
      // state.loading = true
    })
    builder.addCase(getPromptById.fulfilled, (state, action) => {
      // state.loading = false
      let currPrompts = state.loadedPrompts
      const promptId = action.payload.id
      let match = false
      currPrompts.forEach((p) => {
        if (p.id === promptId) {
          p = action.payload
          match = true
        }
      })
      if (match) {
        return state
      }
      state.loadedPrompts = [...state.loadedPrompts , action.payload]
    })
    builder.addCase(getPromptById.rejected, (state, action) => {
      // state.loading = false
      console.error('error fetching prompt from server')
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
