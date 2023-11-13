import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { PromptPart } from "../../app/types"
import axios from 'axios'

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
  }
}

export const getPromptList = createAsyncThunk(
  'prompt/getPromptList',
  async (thunkAPI) => {
    const path = `http://localhost:5173/api/prompts`
    const response = await axios.get(path)
    console.log('getPromptList response', response.data)
    return { ...response.data }
  }
)

export const promptGallerySlice = createSlice({
  name: "promptGallery",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getPromptList.pending, (state) => {
      console.log('loading')
      state.loadedData.loading = true
      return state
    })
    builder.addCase(getPromptList.fulfilled, (state, action) => {
      console.log(action.payload)
      state.loadedData.promptIds.data = action.payload.prompts
    })
    builder.addCase(getPromptList.rejected, (state, action) => {
      // state.loading = false
      console.error('error fetching prompt from server')
    })
  }
})

export const {
} = promptGallerySlice.actions

export default promptGallerySlice.reducer
