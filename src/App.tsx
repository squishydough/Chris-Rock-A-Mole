import React from 'react'
import './App.css'
import { AnimatePresence, motion } from 'framer-motion'
import {
  initialState,
  reducer,
  removeChrisRock,
  addToSpawnQueue,
  removeFromSpawnQueue,
  slapChrisRock,
  updateScore,
} from './slice'
import { random } from './utils'
import { CONFIG } from './config'
import { ChrisRock } from './types'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { chrisRocks, score, spawnQueue } = state

  const onSlap = (id: string, status: 'hit' | 'unhit') => {
    if (status === 'hit') return
    const chrisRock = chrisRocks.find((c) => c.id === id)
    if (!chrisRock) return
    dispatch(slapChrisRock({ id }))
    dispatch(updateScore(score + 1))
    dispatch(removeChrisRock(chrisRock))
  }

  /**
   * Keep spawning Chris Rocks until the maxSpawns is reached.
   */
  React.useEffect(() => {
    if (chrisRocks.length + spawnQueue.length >= CONFIG.maxSpawns) return

    const unhitImage =
      CONFIG.images.unhit[random(0, CONFIG.images.unhit.length - 1)]
    const hitImage = CONFIG.images.hit[random(0, CONFIG.images.hit.length - 1)]

    const newChrisRock = {
      id: uuidv4(),
      unhitImage,
      hitImage,
      x: random(0, window.innerWidth - unhitImage.width),
      y: random(0, window.innerHeight - unhitImage.height),
      status: 'unhit',
    } as ChrisRock

    console.info(`Creating a Chris Rock`)
    console.info('chrisRocks', chrisRocks)
    console.info('spawnQueue', spawnQueue)

    dispatch(addToSpawnQueue(newChrisRock))

    setTimeout(() => {
      dispatch(removeFromSpawnQueue(newChrisRock))
    }, random(CONFIG.spawnInterval.min, CONFIG.spawnInterval.max))
  }, [chrisRocks.length, spawnQueue.length])

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
            key={chrisRock.id}
            className="chrisRock-button"
            initial={{ opacity: 1 }}
            animate={{
              scale: chrisRock.status === 'hit' ? 2 : 1,
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
            onClick={(e) => onSlap(chrisRock.id, chrisRock.status)}
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
