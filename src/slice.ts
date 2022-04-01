import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChrisRock, State } from './types'
import { createChrisRock } from './utils'

const initialState = {
  chrisRocks: [createChrisRock()],
  spawnQueue: [],
  score: 0,
} as State

const slice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    addChrisRock: (state, action: PayloadAction<ChrisRock>) => {
      state.chrisRocks.push(action.payload)
    },
    removeChrisRock: (state, action: PayloadAction<string>) => {
      state.chrisRocks = state.chrisRocks.filter((c) => c.id !== action.payload)
    },
    slapChrisRock: (
      state,
      action: PayloadAction<{ id: string; x: number; y: number }>
    ) => {
      state.chrisRocks = state.chrisRocks.map((c) =>
        c.id === action.payload.id
          ? {
              ...c,
              status: 'hit',
              x: action.payload.x - c.hitImage.width / 2,
              y: action.payload.y - c.hitImage.height / 2,
              id: `${c.id}-hit`,
            }
          : c
      )
    },
    addToSpawnQueue: (state, action: PayloadAction<ChrisRock>) => {
      state.spawnQueue.push(action.payload)
    },
    removeFromSpawnQueue: (state, action: PayloadAction<string>) => {
      state.spawnQueue = state.spawnQueue.filter((c) => c.id !== action.payload)
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload
    },
  },
})

const { reducer, actions } = slice
const {
  addChrisRock,
  removeChrisRock,
  addToSpawnQueue,
  removeFromSpawnQueue,
  slapChrisRock,
  updateScore,
} = actions
export {
  initialState,
  reducer,
  addChrisRock,
  removeChrisRock,
  addToSpawnQueue,
  removeFromSpawnQueue,
  slapChrisRock,
  updateScore,
}
