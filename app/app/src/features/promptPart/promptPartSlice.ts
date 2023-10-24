import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"

export interface PromptPartState {
  text: string
  weight: number
}

const initialState: PromptPartState = {
  text: 'a hipster lion wearing a hoodie',
  weight: 1
}

export const promptPartSlice = createSlice({
  name: "promptPart",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    incrementWeight: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.weight += 1
    },
    decrementWeight: (state) => {
      state.weight -= 1
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementWeightByAmount: (state, action: PayloadAction<number>) => {
      state.weight += action.payload
    },
  },
})

export const { incrementWeight, decrementWeight, incrementWeightByAmount } = promptPartSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
//export const selectCount = (state: RootState) => state.counter.value

export default promptPartSlice.reducer
