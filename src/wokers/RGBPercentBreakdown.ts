import workerpool from 'workerpool'

function rgbBreakdown(pixels: any) {
  let red = 0
  let green = 0
  let blue = 0

  pixels.forEach((pixel: any) => {
    red += pixel.x
    green += pixel.y
    blue += pixel.z
  })

  return {
    red,
    green,
    blue,
  }
}

function wrapper(pixels: any) {
  const pool = workerpool.pool()

  return pool.exec(rgbBreakdown, [pixels])
}
