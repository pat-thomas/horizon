import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import promptBuilderReducer from "../features/promptBuilder/promptBuilderSlice"
import promptPartReducer from "../features/promptPart/promptPartSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    promptPart: promptPartReducer,
    promptBuilder: promptBuilderReducer
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
