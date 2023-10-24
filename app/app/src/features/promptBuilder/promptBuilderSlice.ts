import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { PromptPart } from "../../app/types";

export interface PromptBuilderState {
  parts: [PromptPart]
}

const initialState: PromptBuilderState = {
  parts: [{
    text: 'chunky lion',
    weight: 1
  }]
}

export const promptBuilderSlice = createSlice({
  name: "promptBuilder",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addPart: (state) => {
      const lastPart = state.parts[state.parts.length-1];
      console.log('lastPart', lastPart)
      state.parts = [...state.parts,
        {index: state.parts.length+1,
          text: lastPart.text,
          weight: 0}
      ];
      return state
    },
    removePart: (state) => {
      // TOOD: append new blank prompt part to state
      return state
    },
    updatePartText: (state, action) => {
      const {
        text,
        index
      } = action.payload
      console.log('updatePartText')
      state.parts[index].text = text
    },
    incrementPartWeight: (state, action) => {
      const index = action.payload.index
      const part = state.parts[index]
      state.parts[index].weight += 1
    }
  },
})

export const {
  addPart,
  removePart,
  updatePartText,
  incrementPartWeight
} = promptBuilderSlice.actions

export default promptBuilderSlice.reducer
