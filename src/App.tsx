import React from 'react'
import './App.css'

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

function getRandomPosition(imageWidth: number, imageHeight: number) {
  return {
    x: randomNumber(0, window.innerWidth - imageWidth),
    y: randomNumber(0, window.innerHeight - imageHeight),
  }
}

const getRandomJokeImage = () =>
  jokeImages[randomNumber(0, jokeImages.length - 1)]
const getRandomHitImage = () => hitImages[randomNumber(0, hitImages.length - 1)]

function App() {
  const randomImage = getRandomJokeImage()
  const [image, setImage] = React.useState({
    ...randomImage,
    ...getRandomPosition(randomImage.width, randomImage.height),
    isClickable: true,
  })

  const [score, setScore] = React.useState(0)
  const [isActive, setIsActive] = React.useState(true)

  const handleImageClick = () => {
    setScore(score + 1)
    setImage({
      ...image,
      ...getRandomHitImage(),
      isClickable: false,
    })
    setTimeout(spawnNewImage, 500)
  }

  const spawnNewImage = () => {
    const randomImage = getRandomJokeImage()
    setImage({
      ...randomImage,
      ...getRandomPosition(randomImage.width, randomImage.height),
      isClickable: true,
    })
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
      {isActive ? (
        <div className="imageContainer">
          <img
            src={image.src}
            alt="Chris Rock's face - slap it!"
            className="chrisRock"
            style={{
              position: 'absolute',
              left: `${image.x}px`,
              top: `${image.y}px`,
            }}
            onClick={handleImageClick}
          />
          {!image.isClickable && (
            <React.Fragment>
              <img
                src="/slap.png"
                alt="Graphic stating SLAP!"
                className="slap"
                style={{
                  position: 'absolute',
                  left: `${image.x}px`,
                  top: `${image.y}px`,
                  zIndex: 2,
                }}
              />
              <img
                src="will.png"
                alt="Will Smith about to slap a Chris Rock."
                style={{
                  position: 'absolute',
                  left: `${image.x - 150}px`,
                  top: `${image.y - 150}px`,
                  zIndex: 2,
                }}
              />
            </React.Fragment>
          )}
        </div>
      ) : (
        <div className="buttonContainer">
          <button
            type="button"
            onClick={() => setIsActive(true)}
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

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
