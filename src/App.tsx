import React from 'react'
import './App.css'
import { AnimatePresence, motion } from 'framer-motion'
import {
  initialState,
  reducer,
  addChrisRock,
  removeChrisRock,
  addToSpawnQueue,
  removeFromSpawnQueue,
  slapChrisRock,
  updateScore,
} from './slice'
import { random } from './utils'
import { CONFIG } from './config'

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { chrisRocks, score } = state

  const onSlap = (
    id: string,
    status: 'hit' | 'unhit',
    x: number,
    y: number
  ) => {
    if (status !== 'unhit') return
    dispatch(slapChrisRock({ id, x, y }))
    dispatch(updateScore(1))
    dispatch(removeChrisRock(id))
  }

  return (
    <div className="App">
      <header className="header">
        <div className="title">Chris Rock-A-Mole</div>
        <div className="score">
          SLAPS: {score}
          <br />
          <div style={{ fontSize: 11 }}>(You can't miss...yet)</div>
        </div>
        <div className="actions"></div>
      </header>
      <AnimatePresence>
        {chrisRocks.map((chrisRock) => (
          <motion.button
            /**
             * Changing the `key` prop forces the component to re-render.
             * The `key` gets '-hit' appended on when `slapChrisRock` is dispatched.
             * This allows more customization of the exit animation,
             * such as the duration, without using the built in `exit` prop.
             */
            key={chrisRock.id}
            className="chrisRock-button"
            initial={{ x: chrisRock.x, y: chrisRock.y, opacity: 1 }}
            animate={{
              /**
               * Animate towards either the left or right side of the screen
               */
              x:
                random(0, 1) === 0
                  ? window.innerWidth + chrisRock.hitImage.width
                  : 0 - chrisRock.hitImage.width,
              /**
               * Animates towards either the top or bottom of the screen
               */
              y:
                random(0, 1) === 0
                  ? window.innerHeight + chrisRock.hitImage.height
                  : 0 - chrisRock.hitImage.height,
              /**
               * If hit, randomly rotate left or right.
               */
              rotate:
                chrisRock.status === 'hit'
                  ? random(0, 1) === 0
                    ? -720
                    : 720
                  : undefined,
              /**
               * If hit, fade out the component.
               */
              opacity: chrisRock.status === 'hit' ? 0 : 1,
            }}
            transition={{
              duration:
                /**
                 * If hit, duration should be 1 second.
                 * If unhit, duration is a random number based on the CONFIG.
                 */
                chrisRock.status === 'hit'
                  ? 1
                  : random(CONFIG.spawnDuration.min, CONFIG.spawnDuration.max),
              ease: 'linear',
            }}
            /**
             * `e.clientX` and `e.clientY` are the coordinates of the mouse.
             */
            onClick={(e) =>
              onSlap(chrisRock.id, chrisRock.status, e.clientX, e.clientY)
            }
          >
            <img
              src={
                chrisRock.status === 'unhit'
                  ? chrisRock.unhitImage.src
                  : chrisRock.hitImage.src
              }
              alt="Face of Chris Rock, ready to slap!"
            />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default App
