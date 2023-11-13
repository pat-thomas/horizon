import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import promptBuilderReducer from "../features/promptBuilder/promptBuilderSlice"
import promptGalleryReducer from "../features/promptGallery/promptGallerySlice"
import { combineReducers  } from "redux"
import { connectRouter } from "connected-react-router"
import { createBrowserHistory } from "history"

export const history = createBrowserHistory()

export const store = configureStore({
  reducer: {
    router: connectRouter(history),
    promptBuilder: promptBuilderReducer,
    promptGallery: promptGalleryReducer
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
