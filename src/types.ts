export interface Image {
  src: string
  width: number
  height: number
}

export interface ChrisRock {
  id: string
  unhitImage: Image
  hitImage: Image
  x: number
  y: number
  status: 'hit' | 'unhit'
}

export interface State {
  chrisRocks: ChrisRock[]
  spawnQueue: ChrisRock[]
  score: number
}
