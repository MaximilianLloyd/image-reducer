import { useState, useRef } from 'react'
import classNames from 'classnames'

import Loader from 'components/Loader'
import Button from './components/styled/Button'

import StyledApp from './StyledApp'

// import Matrix from './assets/images/matrix.jpg'

// import rgbToHex from './helpers/rgbToHex'
import drawImageArray from './helpers/drawImageArray'

import kmeans from './wokers/k-means'
import { PixelVector } from 'types/vector'

const App: React.FC = () => {
  const [centroids, setCentroids] = useState(3)
  const [iterations, setIterations] = useState(3)

  const [loading, setLoading] = useState(false)
  const [size, setSize] = useState({
    width: 500,
    height: 300,
  })
  const [resultImageSrc, setResultImageSrc] = useState('')
  const [hasReducedOnce, setHasReducedOnce] = useState(false)
  // const canvasRef: any = useRef()
  const imageRef: any = useRef()

  const reduce = async () => {
    if (!hasReducedOnce) setHasReducedOnce(true)
    setLoading(true)
    const internalCanvas: any = document.createElement('canvas')

    // const canvasAndImageExists = imageRef.current

    if (imageRef.current) {
      // const context = canvas.getContext('2d')
      const canvasHeight = size.height
      const canvasWidth = size.width

      // context.drawImage(imageRef.current, 0, 0);
      const internalContext = internalCanvas.getContext('2d')
      internalCanvas.width = canvasWidth
      internalCanvas.height = canvasHeight

      internalContext.drawImage(imageRef.current, 0, 0, canvasWidth, canvasHeight)

      const imgData = internalContext.getImageData(0, 0, canvasWidth, canvasHeight)
      const { data } = imgData

      const [predictedPixels, calculatedCentroids] = await kmeans(data, centroids, iterations)
      setLoading(false)

      console.log(calculatedCentroids)

      const newImage: number[] = []

      predictedPixels.forEach((pixel: any) => {
        const { x: red, y: green, z: blue } = pixel.centroid!

        newImage.push(red)
        newImage.push(green)
        newImage.push(blue)
        newImage.push(255) // alpha
      })

      drawImageArray(internalContext, newImage, canvasWidth, canvasHeight)
      setTimeout(() => {
        setResultImageSrc(internalCanvas.toDataURL())
      })
    }
  }

  const onFileUpload = (event: any) => {
    const [file] = event.target.files
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      console.log(image.width, image.height)
      imageRef.current = image
      setSize({
        width: image.width,
        height: image.height,
      })
    }
    // console.log(image)
    // console.log(imageRef.current)
  }

  return (
    <StyledApp>
      <div className="content">
        <h1>Image reducer</h1>
        {/* <img style={{ display: 'none' }} src={Matrix} alt="Matrix" ref={(el) => (imageRef.current = el)} /> */}
        <div className="file-upload-container">
          <input type="file" id="single" onChange={onFileUpload} />
        </div>
        <div className="inputs">
          <Button onClick={reduce}>Reduce image</Button>
          <label>Centroids {centroids}</label>
          <input type="number" value={centroids} onChange={(event: any) => setCentroids(event.target.value)} />

          <label>Iterations</label>
          <input type="number" value={iterations} onChange={(event: any) => setIterations(event.target.value)} />
        </div>
        {loading && <Loader />}
        {/* <canvas
          width={size.width}
          height={size.height}
          id="canvas"
          className={classNames({ hidden: true })}
          ref={(c) => (canvasRef.current = c)}
        /> */}
        {resultImageSrc && <img className="result-image" src={resultImageSrc} />}
      </div>
    </StyledApp>
  )
}

export default App
