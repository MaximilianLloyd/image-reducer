import workerpool from 'workerpool'
import Vector, { PixelVector, Centroid } from 'types/vector'

// remember to pass this to the worker
// import indexOfMin from 'helpers/indexOfMin'
// todo: the issue here is the dissasociasion of children
function indexOfSmallest(a: any) {
  let lowest = 0
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[lowest]) lowest = i
  }
  return lowest
}

function randomClamped255() {
  return Math.floor(Math.random() * 255)
}

function getVertex3InMatrix(matrix: any, index: number) {
  const x = matrix[index + 0]
  const y = matrix[index + 1]
  const z = matrix[index + 2]

  return [x, y, z]
}

function kmeans(inputPixels: Uint8ClampedArray[], numberOfCentroids: number, iterations = 5): any {
  const RED_INDEX = 0
  const GREEN_INDEX = 1
  const BLUE_INDEX = 2

  // @TODO: Find out how to move this into it's own file and regiter it here.
  // R - G - B
  const centroids = new Uint8ClampedArray(numberOfCentroids * 3)
  const rgbPixels = new Uint8ClampedArray(inputPixels as any)

  // Place centroids randmly
  for (let cI = 0; cI < centroids.length; cI += 3) {
    const red = randomClamped255()
    const green = randomClamped255()
    const blue = randomClamped255()

    centroids[cI + RED_INDEX] = red
    centroids[cI + GREEN_INDEX] = green
    centroids[cI + BLUE_INDEX] = blue
  }

  // Initial assignment
  for (let pixelIndex = 0; pixelIndex < rgbPixels.length; pixelIndex += 4) {
    const [pRed, pGreen, pBlue] = getVertex3InMatrix(rgbPixels, pixelIndex)

    const deltas = []

    for (let j = 0; j < centroids.length; j += 3) {
      const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, j)

      const delta = Math.abs(pRed - cRed) + Math.abs(pGreen - cGreen) + Math.abs(pBlue - cBlue)
      deltas.push(delta)
    }

    const centroidIndex = indexOfSmallest(deltas)
    const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, centroidIndex * 3)

    rgbPixels[pixelIndex + RED_INDEX] = cRed
    rgbPixels[pixelIndex + GREEN_INDEX] = cGreen
    rgbPixels[pixelIndex + BLUE_INDEX] = cBlue
  }

  console.log(iterations)

  for (let _ = 0; _ < iterations; _++) {
    for (let cI = 0; cI < centroids.length; cI += 3) {
      const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, cI)

      let newRed = 0
      let newGreen = 0
      let newBlue = 0
      let count = 0

      for (let pI = 0; pI < rgbPixels.length; pI += 4) {
        const [pRed, pGreen, pBlue] = getVertex3InMatrix(rgbPixels, pI)

        const isAssociated = pRed === cRed && pGreen === cGreen && pBlue === cBlue

        if (isAssociated) {
          newRed += pRed
          newGreen += pGreen
          newBlue += pBlue
          count++
        }
      }

      newRed = Math.floor(newRed / count)
      newGreen = Math.floor(newGreen / count)
      newBlue = Math.floor(newBlue / count)

      centroids[cI + RED_INDEX] = newRed
      centroids[cI + GREEN_INDEX] = newGreen
      centroids[cI + BLUE_INDEX] = newBlue
    }

    console.log(centroids)

    for (let pixelIndex = 0; pixelIndex < rgbPixels.length; pixelIndex += 4) {
      const [pRed, pGreen, pBlue] = getVertex3InMatrix(rgbPixels, pixelIndex)

      const deltas = []

      for (let j = 0; j < centroids.length; j += 3) {
        const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, j)

        const delta = Math.abs(pRed - cRed) + Math.abs(pGreen - cGreen) + Math.abs(pBlue - cBlue)
        deltas.push(delta)
      }

      const centroidIndex = indexOfSmallest(deltas)
      const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, centroidIndex * 3)

      rgbPixels[pixelIndex + RED_INDEX] = cRed
      rgbPixels[pixelIndex + GREEN_INDEX] = cGreen
      rgbPixels[pixelIndex + BLUE_INDEX] = cBlue
    }
  }

  return rgbPixels
}

function wrapper(pixels: Uint8ClampedArray[], centroids: number, iterations: number): any {
  const pool = workerpool.pool()

  // return pool.exec(kmeans, [pixels, centroids, iterations])
  return kmeans(pixels, centroids, iterations)
}

export default wrapper
