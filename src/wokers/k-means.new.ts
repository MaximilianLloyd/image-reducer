import workerpool from 'workerpool'
import Vector, { PixelVector, Centroid } from 'types/vector'

// remember to pass this to the worker
import indexOfMin from 'helpers/indexOfMin'

function kmeans(inputPixels: Uint8ClampedArray[], numberOfCentroids: number, iterations = 5): any {
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

  function randomClamped255() {
    return Math.floor(Math.random() * 255)
  }

  function getVertex3InMatrix(matrix: any, index: number) {
    const x = matrix[index + 0]
    const y = matrix[index + 1]
    const z = matrix[index + 2]

    return [x, y, z]
  }

  const RED_INDEX = 0
  const GREEN_INDEX = 1
  const BLUE_INDEX = 2

  // @TODO: Find out how to move this into it's own file and regiter it here.
  // R - G - B
  const centroids = new Uint8ClampedArray(numberOfCentroids * 3)
  const rgbPixels = new Uint8ClampedArray(inputPixels as any)

  const centroidIndexPerPixel = new Uint8ClampedArray(inputPixels.length / 4)

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
  for (let i = 0; i < rgbPixels.length; i += 4) {
    const [pRed, pGreen, pBlue] = getVertex3InMatrix(rgbPixels, i)

    const deltas = []

    for (let j = 0; j < centroids.length; j += 3) {
      const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, j)

      const delta = Math.abs(pRed - cRed) + Math.abs(pGreen - cGreen) + Math.abs(pBlue - cBlue)
      deltas.push(delta)
    }

    const centroidIndex = indexOfMin(deltas)
    const pixelIndex = i / 4
    centroidIndexPerPixel[pixelIndex] = centroidIndex
    const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, centroidIndex)

    rgbPixels[i + RED_INDEX] = cRed
    rgbPixels[i + GREEN_INDEX] = cGreen
    rgbPixels[i + BLUE_INDEX] = cBlue
  }

  // Iterations

  // for (let _ = 0; _ < iterations; _++) {
  //   for (let j = 0; j < centroids.length; j += 3) {
  //     const centroidIndex = j / 3

  //     let newCentroidRed = 0
  //     let newCentroidGreen = 0
  //     let newCentroidBlue = 0

  //     const numberOfPixelsAssigned = centroidIndexPerPixel.filter((v) => v === centroidIndex).length

  //     for (let pixelIndex = 0; pixelIndex < rgbPixels.length; pixelIndex += 4) {
  //       const wholePixelIndex = pixelIndex / 4
  //       const cppIndex = centroidIndexPerPixel[wholePixelIndex]
  //       const [pRed, pGreen, pBlue] = getVertex3InMatrix(rgbPixels, pixelIndex)

  //       if (cppIndex === centroidIndex) {
  //         newCentroidRed += pRed
  //         newCentroidGreen += pGreen
  //         newCentroidBlue += pBlue
  //       }
  //     }

  //     centroids[j + RED_INDEX] = newCentroidRed / numberOfPixelsAssigned
  //     centroids[j + GREEN_INDEX] = newCentroidGreen / numberOfPixelsAssigned
  //     centroids[j + BLUE_INDEX] = newCentroidBlue / numberOfPixelsAssigned
  //   }

  //   for (let i = 0; i < rgbPixels.length; i += 4) {
  //     const [pRed, pGreen, pBlue] = getVertex3InMatrix(rgbPixels, i)

  //     const deltas = []

  //     for (let jj = 0; jj < centroids.length; jj += 3) {
  //       const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, jj)

  //       const delta = Math.abs(pRed - cRed) + Math.abs(pGreen - cGreen) + Math.abs(pBlue - cBlue)
  //       deltas.push(delta)
  //     }

  //     const centroidIndex = indexOfMin(deltas)
  //     const [cRed, cGreen, cBlue] = getVertex3InMatrix(centroids, centroidIndex)

  //     rgbPixels[i + RED_INDEX] = cRed
  //     rgbPixels[i + GREEN_INDEX] = cGreen
  //     rgbPixels[i + BLUE_INDEX] = cBlue
  //   }
  // }

  return rgbPixels
}

function wrapper(pixels: Uint8ClampedArray[], centroids: number, iterations: number): any {
  const pool = workerpool.pool()

  const newFunc = indexOfMin

  // return pool.exec(kmeans, [pixels, centroids, iterations])
  return kmeans(pixels, centroids, iterations)
}

export default wrapper
