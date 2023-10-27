import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { PromptPart } from "../../app/types";

export interface PromptBuilderState {
  parts: [PromptPart]
}

const initialState: PromptBuilderState = {
  parts: [
    {
      text: 'face , minimal',
      weight: 1,
      backgroundColor: {
        r: 30,
        g: 100,
        b: 120,
      }
    }
  ],
  settings: {
    weightDifference: 0.25,
    style: 250,
    chaos: 0
  }
}

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
      let lastPart = state.parts[state.parts.length-1];
      lastPart = lastPart || initialState.parts[0];
      state.parts = [...state.parts,
        {
          index: state.parts.length+1,
          text: lastPart.text,
          weight: lastPart.weight,
          backgroundColor: {
            r: lastPart.backgroundColor.r + 30,
            g: lastPart.backgroundColor.g - 25,
            b: lastPart.backgroundColor.b + 5
          }
        }
      ];
    },
    removePart: (state, action) => {
      const currParts = state.parts
      const index = action.payload.index
      state.parts = [
        ...currParts.slice(0, index),
        ...currParts.slice(index+1, currParts.length)
      ]
    },
    updatePartText: (state, action) => {
      const {
        text,
        index
      } = action.payload
      state.parts[index].text = text
    },
    incrementPartWeight: (state, action) => {
      const weightDifference = Number(state.settings.weightDifference)
      const index = action.payload.index
      const part = state.parts[index]
      state.parts[index].weight += weightDifference
    },
    decrementPartWeight: (state, action) => {
      const weightDifference = Number(state.settings.weightDifference)
      const index = action.payload.index
      const part = state.parts[index]
      state.parts[index].weight -= weightDifference
    }
  },
})

export const {
  addPart,
  removePart,
  updatePartText,
  incrementPartWeight,
  decrementPartWeight,
  updateSettingWeightDifference,
  updateSettingStyle,
  updateSettingChaos
} = promptBuilderSlice.actions

export default promptBuilderSlice.reducer
