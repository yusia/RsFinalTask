export interface CanvasStep {
  //? поясните разницу мужду этим
  coords: {
    x: number,
    y: number
  }[
  ],
  //? и этим
  //? coords: [{
  //?   x: number,
  //?   y: number
  //? }
  //? ],
  lineWidth?: number,
  strokeStyle?: string | CanvasGradient | CanvasPattern,
}