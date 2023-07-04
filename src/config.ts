import { Image } from './types'

/**
 * Basic configuration options for the game
 */
export const CONFIG = {
  // The maximum number of Chris Rocks to generate
  maxSpawns: 5,
  // The range of seconds that the Chris Rocks will be on screen
  spawnDuration: {
    min: 3,
    max: 5,
  },
  // The range of seconds before a new Chris Rock will spawn
  spawnInterval: {
    min: 1,
    max: 2,
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
