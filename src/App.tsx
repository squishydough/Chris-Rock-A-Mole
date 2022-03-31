import React from 'react'
import './App.css'
import { v4 as uuidv4 } from 'uuid'

interface Image {
  src: string
  width: number
  height: number
}

interface ChrisRock {
  id: string
  unhitImage: Image
  hitImage: Image
  x: number
  y: number
}

interface State {
  chrisRocks: ChrisRock[]
  score: number
}

/**
 * Basic configuration options for the game
 */
const CONFIG = {
  // The maximum number of Chris Rocks to generate
  maxSpawns: 1,
  // The range of time that the Chris Rocks will be on screen
  spawnDuration: {
    min: 2000,
    max: 4500,
  },
  // The range of time before a new Chris Rock will spawn
  spawnInterval: {
    min: 1000,
    max: 2000,
  },
  // The images for the unhit and hit stage of the Chris Rock
  images: {
    unhit: [
      { src: '/unhit1.png', width: 175, height: 292 },
      { src: '/unhit2.png', width: 175, height: 239 },
      { src: '/unhit3.png', width: 175, height: 238 },
    ] as Image[],
    hit: [
      { src: '/hit1.png', width: 175, height: 260 },
      { src: '/hit2.png', width: 177, height: 236 },
      { src: '/hit3.png', width: 175, height: 236 },
    ] as Image[],
  },
}

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const generateChrisRock = (
  unhitImageIndex: number | null = null
): ChrisRock => {
  const unhitImage =
    unhitImageIndex === null
      ? CONFIG.images.unhit[randomNumber(0, CONFIG.images.unhit.length - 1)]
      : CONFIG.images.unhit[unhitImageIndex]
  const hitImage =
    CONFIG.images.hit[randomNumber(0, CONFIG.images.hit.length - 1)]
  const x = randomNumber(0, window.innerWidth - unhitImage.width)
  const y = randomNumber(0, window.innerHeight - unhitImage.height)
  const id = uuidv4()
  return {
    unhitImage,
    hitImage,
    id,
    x,
    y,
  }
}

function App() {
  const [score, setScore] = React.useState(0)
  const [chrisRocks, setChrisRocks] = React.useState<ChrisRock[]>([])

  const spawnChrisRock = React.useCallback(() => {
    if (chrisRocks.length >= CONFIG.maxSpawns) {
      return
    }
    const newChrisRock = generateChrisRock()
    setChrisRocks([...chrisRocks, newChrisRock])

    // Schedule the next spawn
    const timeoutInterval = randomNumber(
      CONFIG.spawnInterval.min,
      CONFIG.spawnInterval.max
    )
    setTimeout(spawnChrisRock, timeoutInterval)
  }, [chrisRocks])

  const despawnChrisRock = (id: string, pointScored: boolean) => {
    setScore((prev) => (pointScored ? prev + 1 : prev - 1))
    setChrisRocks(chrisRocks.filter((chrisRock) => chrisRock.id !== id))
  }

  spawnChrisRock()

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
      {chrisRocks.map(({ unhitImage, hitImage, x, y, id }) => (
        <ChrisRockComponent
          key={id}
          id={id}
          unhitImage={unhitImage}
          hitImage={hitImage}
          x={x}
          y={y}
          onSlap={() => despawnChrisRock(id, true)}
          onDespawn={() => despawnChrisRock(id, false)}
        />
      ))}
    </div>
  )
}

export default App

interface ChrisRockComponentProps extends ChrisRock {
  onSlap(): void
  onDespawn(): void
}

function ChrisRockComponent({
  onSlap,
  onDespawn,
  unhitImage,
  hitImage,
  x,
  y,
  id,
}: ChrisRockComponentProps) {
  const [clickable, setClickable] = React.useState(true)

  const handleClick = () => {
    if (!clickable) {
      return
    }
    setClickable(false)
    // setTimeout(onSlap, 500)
    onSlap()
  }

  /**
   * Start the timer to despawn the Chris Rock
   */
  React.useEffect(() => {
    const timeoutInterval = randomNumber(
      CONFIG.spawnDuration.min,
      CONFIG.spawnDuration.max
    )
    const timeoutId = setTimeout(onDespawn, timeoutInterval)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [onDespawn, id])

  return (
    <div className="imageContainer">
      <img
        src={clickable ? unhitImage.src : hitImage.src}
        alt="Chris Rock's face - slap it!"
        className="chrisRock"
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
        }}
        onClick={handleClick}
      />
      {!clickable && (
        <React.Fragment>
          <img
            src="/slap.png"
            alt="Graphic stating SLAP!"
            className="slap"
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              zIndex: 2,
            }}
          />
          <img
            src="will.png"
            alt="Will Smith about to slap a Chris Rock."
            style={{
              position: 'absolute',
              left: `${x - 150}px`,
              top: `${y - 150}px`,
              zIndex: 2,
            }}
          />
        </React.Fragment>
      )}
    </div>
  )
}
