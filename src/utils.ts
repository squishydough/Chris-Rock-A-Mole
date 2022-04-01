import { v4 as uuidv4 } from 'uuid'
import { ChrisRock } from './types'
import { CONFIG } from './config'

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const createChrisRock = (): ChrisRock => {
  const unhitImage =
    CONFIG.images.unhit[random(0, CONFIG.images.unhit.length - 1)]
  const hitImage = CONFIG.images.hit[random(0, CONFIG.images.hit.length - 1)]
  return {
    id: uuidv4(),
    unhitImage,
    hitImage,
    x: random(0, window.innerWidth - unhitImage.width),
    y: random(0, window.innerHeight - unhitImage.height),
    status: 'unhit',
  }
}
