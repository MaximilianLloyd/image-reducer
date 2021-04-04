import workerpool from 'workerpool'
import { GPU } from 'gpu.js'
import Vector, { PixelVector, Centroid } from 'types/vector'

// remember to pass this to the worker
import indexOfMin from 'helpers/indexOfMin'

function kmeans(pixels: number[], numberOfCentroids: number, iterations = 5): any {
  function indexOfMin(arr: number[]): number {
    if (arr.length === 0) {
      return -1
    }

    let max = arr[0]
    let maxIndex = 0

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < max) {
        maxIndex = i
        max = arr[i]
      }
    }

    return maxIndex
  }

  const rgbPixels: PixelVector[] = []
  const centroids: Centroid[] = []

  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i]
    const green = pixels[i + 1]
    const blue = pixels[i + 2]
    // const alpha = pixels[i + 3]

    const vector: PixelVector = {
      x: red,
      y: green,
      z: blue,
    }

    rgbPixels.push(vector)
  }

  // place centoroids randomly
  for (let i = 0; i < numberOfCentroids; i++) {
    const vector = {
      x: Math.floor(Math.random() * 255),
      y: Math.floor(Math.random() * 255),
      z: Math.floor(Math.random() * 255),
    }

    const centroid: Centroid = { ...vector, children: [], history: [vector] }
    centroids.push(centroid)
  }

  // Initial assignment
  rgbPixels.forEach((pixel) => {
    const { x: pRed, y: pGreen, z: pBlue } = pixel

    const deltas: number[] = centroids.map((centroid) => {
      const { x: cRed, y: cGreen, z: cBlue } = centroid

      const delta = Math.abs(pRed - cRed) + Math.abs(pGreen - cGreen) + Math.abs(pBlue - cBlue)
      return delta
    })
    // asign pixel to a centroid
    const cIndex = indexOfMin(deltas)
    const centroid = centroids[cIndex]

    pixel.centroid = centroid
    centroid.children.push(pixel)
  })

  for (let i = 0; i < iterations; i++) {
    centroids.forEach((centroid) => {
      const numberOfPixles = centroid.children.length
      const newPosition: Vector = { x: 0, y: 0, z: 0 }

      centroid.children.forEach((pixel: any) => {
        newPosition.x += pixel.x
        newPosition.y += pixel.y
        newPosition.z += pixel.z
      })

      centroid.x = newPosition.x / numberOfPixles
      centroid.y = newPosition.y / numberOfPixles
      centroid.z = newPosition.z / numberOfPixles

      centroid.history.push({
        x: centroid.x,
        y: centroid.y,
        z: centroid.z,
      })

      centroid.children = []
    })

    rgbPixels.forEach((pixel) => {
      const { x: pRed, y: pGreen, z: pBlue } = pixel

      const deltas: number[] = centroids.map((centroid) => {
        const { x: cRed, y: cGreen, z: cBlue } = centroid

        const delta = Math.abs(pRed - cRed) + Math.abs(pGreen - cGreen) + Math.abs(pBlue - cBlue)
        return delta
      })
      // asign pixel to a centroid
      const cIndex = indexOfMin(deltas)
      const centroid = centroids[cIndex]

      pixel.centroid = {
        x: centroid.x,
        y: centroid.y,
        z: centroid.z,
      }

      centroid.children.push(pixel)
    })
  }

  return [rgbPixels, centroids]
}

function wrapper(pixels: number[], centroids: number, iterations: number): any {
  const pool = workerpool.pool()

  console.log(centroids, iterations)

  return pool.exec(kmeans, [pixels, centroids, iterations])
  // return kmeans(pixels, centroids, iterations)
}

export default wrapper
