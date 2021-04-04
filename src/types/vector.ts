interface Vector {
  x: number
  y: number
  z: number
}

export interface Centroid extends Vector {
  children: any
  history: Vector[]
}

export interface PixelVector extends Vector {
  centroid?: Vector
}

export default Vector
