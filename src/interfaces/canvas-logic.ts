export interface CanvasStep {
  coords: [
    {
      x: number,
      y: number
    }
  ],
  lineWidth?: number,
  strokeStyle?: string | CanvasGradient | CanvasPattern,
}