import React from 'react'
import './App.css'

interface ChrisRock {
  id: string
  jokeImage: Image
  hitImage: Image
  x: number
  y: number
}

interface Image {
  src: string
  width: number
  height: number
}

const jokeImages: Image[] = [
  { src: '/joke1.png', width: 175, height: 292 },
  { src: '/joke2.png', width: 175, height: 239 },
  { src: '/joke3.png', width: 175, height: 238 },
]

const hitImages: Image[] = [
  { src: '/hit1.png', width: 175, height: 260 },
  { src: '/hit2.png', width: 177, height: 236 },
  { src: '/hit3.png', width: 175, height: 236 },
]

const generateChrisRock = (jokeImageIndex: number | null = null) => {
  const jokeImage =
    jokeImageIndex === null ? getRandomJokeImage() : jokeImages[jokeImageIndex]
  const hitImage = getRandomHitImage()
  const { x, y } = getRandomPosition(jokeImage.width, jokeImage.height)
  const id = `${jokeImage.src}-${hitImage.src}-${x}-${y}`

  const newChrisRock: ChrisRock = {
    jokeImage,
    hitImage,
    id,
    x,
    y,
  }
  return newChrisRock
}

const getRandomPosition = (imageWidth: number, imageHeight: number) => {
  return {
    x: randomNumber(0, window.innerWidth - imageWidth),
    y: randomNumber(0, window.innerHeight - imageHeight),
  }
}

const getRandomJokeImage = () =>
  jokeImages[randomNumber(0, jokeImages.length - 1)]

const getRandomHitImage = () => hitImages[randomNumber(0, hitImages.length - 1)]

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function App() {
  const [score, setScore] = React.useState(0)
  const [isGameActive, setIsGameActive] = React.useState(true)
  const [chrisRocks, setChrisRocks] = React.useState<ChrisRock[]>([])

  const handleImageClick = (chrisRockId: string) => {
    const newScore = score + 1
    const newChrisRocks = chrisRocks.filter(
      (chrisRock) => chrisRock.id !== chrisRockId
    )

    setTimeout(() => {
      const newChrisRock = generateChrisRock()
      newChrisRocks.push(newChrisRock)
      setScore(newScore)
      setChrisRocks(newChrisRocks)
    }, 500)
  }

  /**
   * Initially spawn one of each Chris Rock.
   */
  React.useEffect(() => {
    const initialChrisRocks: ChrisRock[] = []

    for (let i = 0; i < jokeImages.length; i++) {
      const newChrisRock = generateChrisRock(i)
      initialChrisRocks.push(newChrisRock)
      setChrisRocks(initialChrisRocks)
    }
  }, [])

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
      {isGameActive ? (
        chrisRocks.map(({ jokeImage, hitImage, x, y, id }) => (
          <ChrisRockComponent
            key={id}
            id={id}
            onClick={() => handleImageClick(id)}
            jokeImage={jokeImage}
            hitImage={hitImage}
            x={x}
            y={y}
          />
        ))
      ) : (
        <div className="buttonContainer">
          <button
            type="button"
            onClick={() => setIsGameActive(true)}
            className="button"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  )
}

export default App

interface ChrisRockProps extends ChrisRock {
  onClick(chrisRockId: string): void
}

function ChrisRockComponent({
  onClick,
  jokeImage,
  hitImage,
  x,
  y,
  id,
}: ChrisRockProps) {
  const [clickable, setClickable] = React.useState(true)

  const handleClick = () => {
    if (!clickable) {
      return
    }
    setClickable(false)
    onClick(id)
  }

  return (
    <div className="imageContainer">
      <img
        src={clickable ? jokeImage.src : hitImage.src}
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
