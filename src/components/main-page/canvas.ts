// import { doc } from 'prettier';
import content from './main-page.html';
// #ACD3ED
export default class Canvas {
  public isDrawing: boolean;
  static context: CanvasRenderingContext2D | undefined;
  static canvas: HTMLCanvasElement | undefined;
  protected drawProgresion: string[];
  protected progrIndex: number;
  startX: number;
  startY: number;

  constructor() {
    this.isDrawing = false;
    this.startX = 2;
    this.startY = 2;
    this.drawProgresion = [];
    this.progrIndex = -1;

  }

  setupCanvas() {
    const mainHtml = document.body.querySelector('#main') as HTMLElement;
    mainHtml.innerHTML = content;
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d',
      {
        willReadFrequently: true
      }
    ) as CanvasRenderingContext2D;
    Canvas.canvas = canvas;
    Canvas.context = context;
  }

  resize() {
    if (Canvas.context && Canvas.canvas) {
      Canvas.context.canvas.width = 400;
      Canvas.context.canvas.height = 400;
      // Canvas.context.canvas.width = Number(window.getComputedStyle(Canvas.canvas).width);
      // Canvas.context.canvas.height = Number(window.getComputedStyle(Canvas.canvas).height);
    }
  }

  giveDrawRights() {
    if (Canvas.canvas) {
      const undoBtn = document.querySelector('.toolbar__clear');
      undoBtn?.addEventListener('click', this.clearCanvas)

      Canvas.canvas.addEventListener('mousedown', this.startDraw);
      Canvas.canvas.addEventListener('mousemove', this.draw);
      Canvas.canvas.addEventListener('mouseup', this.endDraw);
      Canvas.canvas.addEventListener('mouseout', this.endDraw);

      Canvas.canvas.addEventListener("touchstart", this.startDraw);
      Canvas.canvas.addEventListener("touchmove", this.draw);
      Canvas.canvas.addEventListener("touchend", this.endDraw);
      Canvas.canvas.addEventListener("touchcancel", this.endDraw);
    }
  }
  removeDrawRights() {
    if (Canvas.canvas) {
      const canvas = Canvas.canvas;
      canvas.removeEventListener('mousedown', this.startDraw);
      canvas.removeEventListener('mousemove', this.draw);
      canvas.removeEventListener('mouseup', this.endDraw);
      canvas.removeEventListener('mouseout', this.endDraw);

      canvas.removeEventListener("touchstart", this.startDraw);
      canvas.removeEventListener("touchmove", this.draw);
      canvas.removeEventListener("touchend", this.endDraw);
      canvas.removeEventListener("touchcancel", this.endDraw);
    }
  }

  clearCanvas() {
    if (Canvas.context && Canvas.canvas) {
      Canvas.context.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
      this.drawProgresion = ['2'];
      this.progrIndex = -1;
    }
  }
  startDraw(e: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    this.startX = (e as TouchEvent).changedTouches ?
      (e as TouchEvent).changedTouches[0].clientX :
      (e as MouseEvent).clientX;
    this.startY = (e as TouchEvent).changedTouches ?
      (e as TouchEvent).changedTouches[0].clientY :
      (e as MouseEvent).clientY;
    e.preventDefault();
  }

  draw(e: MouseEvent | TouchEvent) {

    if (!this.isDrawing) {
      return;
    }
    if (Canvas.canvas && Canvas.context) {
      const canvasOffsetX = Canvas.canvas.offsetLeft;
      const canvasOffsetY = Canvas.canvas.offsetTop;
      Canvas.context.lineWidth = 5;
      Canvas.context.strokeStyle = '#ACD3ED'
      Canvas.context.lineCap = 'round';
      Canvas.context.lineJoin = 'round';
      Canvas.context.lineTo((e as MouseEvent).clientX - canvasOffsetX, (e as MouseEvent).clientY - canvasOffsetY);
      Canvas.context.stroke();
    }
  }

  endDraw(e: MouseEvent | TouchEvent) {
    this.isDrawing = false;
    if (Canvas.context && Canvas.canvas) {
      Canvas.context.beginPath();
      if (e.type !== 'mouseout') {
        this.progrIndex++;

        console.log(Canvas.context.getImageData(0, 0, Canvas.canvas.width, Canvas.canvas.height));
        //! разберись, почему в момент рисования this.drawProgression === undefined
        // this.drawProgresion.push(Canvas.context.getImageData(0, 0, Canvas.canvas.width, Canvas.canvas.height));
        console.log(this.drawProgresion);
      }
    }

  }

  render() {
    this.setupCanvas();
    this.resize();
    this.giveDrawRights();
  }
}