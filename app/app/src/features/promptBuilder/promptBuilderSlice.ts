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
  }],
  settings: {
    weightDifference: 1
  }
}

export const promptBuilderSlice = createSlice({
  name: "promptBuilder",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateSettingWeightDifference: (state, action) => {
      state.settings.weightDifference = action.payload;
    },
    addPart: (state) => {
      let lastPart = state.parts[state.parts.length-1];
      lastPart = lastPart || initialState.parts[0];
      state.parts = [...state.parts,
        {index: state.parts.length+1,
          text: lastPart.text,
          weight: lastPart.weight}
      ];
    },
    removePart: (state, action) => {
      const index = action.payload
      const currParts = state.parts
      state.parts = [...currParts.splice(0, index-1), ...currParts.splice(index, currParts.length-1)]
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
  updateSettingWeightDifference
} = promptBuilderSlice.actions

export default promptBuilderSlice.reducer
