import workerpool from 'workerpool'

import { PixelVector, Centroid } from 'types/vector'

function kmeans(pixels: number[], numberOfCentroids: number): PixelVector[] {
  console.log('Running k-means. Number of centroids: ', numberOfCentroids)

  const ITERATIONS = 50

  // @TODO: Find out how to move this into it's own file and regiter it here.
  function indexOfMin(arr: number[]) {
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
    const red = Math.floor(Math.random() * 255)
    const green = Math.floor(Math.random() * 255)
    const blue = Math.floor(Math.random() * 255)

    const centroid: Centroid = { x: red, y: green, z: blue, children: [] }
    centroids.push(centroid)
  }

  // Initial assignment

  rgbPixels.forEach((pixel) => {
    const { x: pRed, y: pGreen, z: pBlue } = pixel

    const deltas: number[] = []

    centroids.forEach((centroid) => {
      const { x: cRed, y: cGreen, z: cBlue } = centroid

      const delta = Math.abs(pRed - cRed) + Math.abs(pGreen - cGreen) + Math.abs(pBlue - cBlue)
      deltas.push(delta)
    })
    // asign pixel to a centroid
    const cIndex = indexOfMin(deltas)
    const centroid = centroids[cIndex]
    pixel.centroid = centroid
    centroid.children.push(pixel)
  })

  return rgbPixels
}

function wrapper(pixels: number[], centroids: number): any {
  const pool = workerpool.pool()

  return pool.exec(kmeans, [pixels, centroids])
}

export default wrapper
