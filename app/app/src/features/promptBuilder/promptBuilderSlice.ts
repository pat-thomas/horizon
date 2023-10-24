import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { PromptPart } from "../../app/types";

export interface PromptBuilderState {
  parts: [PromptPart]
}

const initialState: PromptBuilderState = {
  parts: [{
    index: 0,
    text: 'a hipster lion wearing a hoodie',
    weight: 0
  }]
}

export const promptBuilderSlice = createSlice({
  name: "promptBuilder",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addPart: (state) => {
      state.parts = [...state.parts,
        {index: state.parts.length+1,
          text: 'a hipster lion wearing a hoodie',
          weight: 0}
      ];
      return state;
    },
    removePart: (state) => {
      // TOOD: append new blank prompt part to state
      return state;
    },
  },
})

export const { addPart , removePart , getParts } = promptBuilderSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
//export const selectCount = (state: RootState) => state.counter.value

export default promptBuilderSlice.reducer
