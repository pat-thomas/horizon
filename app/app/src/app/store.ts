import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import promptBuilderReducer from "../features/promptBuilder/promptBuilderSlice"
import { combineReducers  } from "redux"
import { connectRouter } from "connected-react-router"
import { createBrowserHistory } from "history"

export const history = createBrowserHistory()

export const store = configureStore({
  reducer: {
    router: connectRouter(history),
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
