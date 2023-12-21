import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { PromptPart } from "../../app/types"
import axios from 'axios'
import { httpGetPromptList , httpGetPromptById } from "../../apiClient"

export interface PromptGalleryState {
  loadedData: {
    promptIds: {
      loading: boolean,
      data: [string]
    }
  }
}

const initialState: PromptGalleryState = {
  loadedData: {
    promptIds: {
      loading: true,
      data: []
    }
  },
  gallery: {
    richPromptsById: {
    }
  }
}

export const getPromptList = createAsyncThunk(
  'prompt/getPromptList',
  httpGetPromptList
)

export const getPromptById = createAsyncThunk(
  'prompt/getPromptById',
  httpGetPromptById
)

export const promptGallerySlice = createSlice({
  name: "promptGallery",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getPromptList.pending, (state) => {
      state.loadedData.loading = true
      return state
    })
    builder.addCase(getPromptList.fulfilled, (state, action) => {
      state.loadedData.promptIds.data = action.payload.prompts
    })
    builder.addCase(getPromptList.rejected, (state, action) => {
      // state.loading = false
    })
    builder.addCase(getPromptById.pending, (state) => {
      return state
      // state.loading = true
    })
    builder.addCase(getPromptById.fulfilled, (state, action) => {
      console.log(action)
      const promptId = action.payload.id
      state.gallery.richPromptsById[promptId] = action.payload
      return state
    })
    builder.addCase(getPromptById.rejected, (state, action) => {
      // state.loading = false
    })
  }
})

export const {
} = promptGallerySlice.actions

export default promptGallerySlice.reducer
