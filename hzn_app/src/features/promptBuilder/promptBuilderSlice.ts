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
      text: 'darth vader made of swiss cheese , melting',
      weight: 1,
      backgroundColor: defaultRgb
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

const initialState: PromptBuilderState = {
  activePrompt: samplePrompt0,
  settings: {
    weightDifference: 0.25,
    style: 250,
    chaos: 0
  },
  loadedPrompts: [
    { ...samplePrompt0, id: 'sample0' },
    //{ ...samplePrompt1, id: 'sample1' },
    //{ ...samplePrompt2, id: 'sample2' }
  ]
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

    builder.addCase(getRandomPrompt.pending, (state) => {
      console.log('PENDING getRandomPrompt')
      return state
    })
    builder.addCase(getRandomPrompt.fulfilled, (state, action) => {
      console.log('getRandomPrompt.fulfilled')
      const {
        promptIndex,
        data
      } = action.payload
      console.log('promptIndex', promptIndex)
      console.log('data', data)
      const randomPrompt = data.prompt_data.prompt
      console.log(state.activePrompt.parts[promptIndex].text)
      state.activePrompt.parts[promptIndex].text = randomPrompt
      return state
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
