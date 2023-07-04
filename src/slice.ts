import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChrisRock, State } from './types'

const initialState = {
  chrisRocks: [],
  spawnQueue: [],
  score: 0,
} as State

const slice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    removeChrisRock: (state, action: PayloadAction<{ id: string }>) => {
      state.chrisRocks = state.chrisRocks.filter(
        (c) => c.id !== action.payload.id
      )
    },
    slapChrisRock: (state, action: PayloadAction<{ id: string }>) => {
      state.chrisRocks = state.chrisRocks.map((c) =>
        c.id === action.payload.id
          ? {
              ...c,
              status: 'hit',
              id: `${c.id}-hit`,
            }
          : c
      )
    },
    addToSpawnQueue: (state, actions: PayloadAction<ChrisRock>) => {
      state.spawnQueue.push(actions.payload)
    },
    removeFromSpawnQueue: (state, action: PayloadAction<ChrisRock>) => {
      console.info('removeFromSpawnQueue', action.payload)
      state.chrisRocks.push(action.payload)
      state.spawnQueue = state.spawnQueue.filter(
        (c) => c.id !== action.payload.id
      )
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload
    },
  },
})

const { reducer, actions } = slice
const {
  removeChrisRock,
  addToSpawnQueue,
  removeFromSpawnQueue,
  slapChrisRock,
  updateScore,
} = actions
export {
  initialState,
  reducer,
  removeChrisRock,
  addToSpawnQueue,
  removeFromSpawnQueue,
  slapChrisRock,
  updateScore,
}
