import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { PromptPart } from "../../app/types"
import axios from 'axios'
import {
  httpGetTourById
}
from "../../apiClient"

export interface Tour {
}

export interface TourBuilderState {
  activeTour: Tour,
  loadedTours: {
    [keys: string]: Tour
  }
}

const initialState: TourBuilderState = {
  activeTour: undefined,
  loadedTours: {
    "default": {
    }
  }
}

export const getTourById = createAsyncThunk(
  'tour/getTourById',
  httpGetTourById
)

export const tourBuilderSlice = createSlice({
  name: "tourBuilder",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getTourById.pending, (state) => {
      return state
    })
    builder.addCase(getTourById.fulfilled, (state, action) => {
      const tourId = action.payload.id
      state.loadedTours[tourId] = action.payload
      state.activeTour = action.payload
      return state
    })
    builder.addCase(getTourById.rejected, (state, action) => {
      return state
    })
  }
  //extraReducers: (builder) => {
  //  builder.addCase(getTourById.pending, (state) => {
  //    //state.loading = true
  //    return state
  //  })
  //  builder.addCase(getTourById.fulfilled, (state, action) => {
  //    const tourId = action.payload.id
  //    state.loadedTours[promptId] = action.payload
  //    return state
  //  })
  //  builder.addCase(getTourById.rejected, (state, action) => {
  //    // state.loading = false
  //  })
  //}
})

//export const {
//} = tourBuilderSlice.actions

export default tourBuilderSlice.reducer
