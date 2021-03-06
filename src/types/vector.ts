interface Vector {
  x: number
  y: number
  z: number
}

export interface Centroid extends Vector {
  children: any
}

export interface PixelVector extends Vector {
  centroid?: Centroid
}

export default Vector
