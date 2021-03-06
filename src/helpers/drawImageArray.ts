// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function drawImageArray(context: any, pixels: number[], width: number, height: number): void {
  const buffer = new Uint8ClampedArray(pixels)
  const data = new ImageData(buffer, width, height)
  context.putImageData(data, 0, 0, 0, 0, width, height)
}

export default drawImageArray
