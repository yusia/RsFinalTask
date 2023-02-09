// import { doc } from 'prettier';
// import { doc } from 'prettier';
import content from './main-page.html';

export default class Canvas {
  public isDrawing: boolean;
  static context: CanvasRenderingContext2D | undefined;
  static canvas: HTMLCanvasElement | undefined;
  static drawProgresion: ImageData[];
  static drawProgresionIndex: number;
  static lineColor = '#acd3ed';
  static lineWidth = 10;
  startX: number;
  startY: number;

  constructor() {
    this.isDrawing = false;
    this.startX = 2;
    this.startY = 2;
    Canvas.drawProgresionIndex = -1;

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
      Canvas.context.canvas.width = 200;
      Canvas.context.canvas.height = 200;
      // Canvas.context.canvas.width = Number(window.getComputedStyle(Canvas.canvas).width);
      // Canvas.context.canvas.height = Number(window.getComputedStyle(Canvas.canvas).height);
    }
  }

  giveDrawRights() {
    if (Canvas.canvas) {
      const clearBtn = document.querySelector('.toolbar__clear') as HTMLElement;
      clearBtn.addEventListener('click', Canvas.clearCanvas);

      const undoBtn = document.querySelector('.toolbar__undo') as HTMLElement;
      undoBtn.addEventListener('click', this.undoLast);

      const lineSizeBtn = document.querySelector('.toolbar__line-width') as HTMLInputElement;
      lineSizeBtn.addEventListener('input', Canvas.changeLineSize);

      const lineColorBtn = document.querySelector('.toolbar__color-all') as HTMLInputElement;
      lineColorBtn.addEventListener('input', Canvas.changeLineColor);

      Canvas.canvas.addEventListener('mousedown', this.startDraw);
      Canvas.canvas.addEventListener('mousemove', this.draw);
      Canvas.canvas.addEventListener('mouseup', this.endDraw);
      // Canvas.canvas.addEventListener('mouseout', this.endDraw);
      Canvas.canvas.addEventListener("touchstart", this.startDraw);
      Canvas.canvas.addEventListener("touchmove", this.draw);
      Canvas.canvas.addEventListener("touchend", this.endDraw);
      // Canvas.canvas.addEventListener("touchcancel", this.endDraw);
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
      Canvas.context.lineWidth = Canvas.lineWidth;
      Canvas.context.strokeStyle = Canvas.lineColor;
      Canvas.context.lineCap = 'round';
      Canvas.context.lineJoin = 'round';
      if ((e as TouchEvent).changedTouches) {
        Canvas.context.lineTo((e as TouchEvent).changedTouches[0].clientX - canvasOffsetX, (e as TouchEvent).changedTouches[0].clientY - canvasOffsetY);
      } else {
        Canvas.context.lineTo((e as MouseEvent).clientX - canvasOffsetX, (e as MouseEvent).clientY - canvasOffsetY);
      }
      Canvas.context.stroke();
    }
  }

  endDraw(e: MouseEvent | TouchEvent) {
    this.isDrawing = false;
    if (Canvas.context && Canvas.canvas) {
      Canvas.context.beginPath();
      if (e.type !== 'mouseout') {
        Canvas.drawProgresionIndex++;
        if (Canvas.drawProgresion === undefined) {
          Canvas.drawProgresion = [];
          Canvas.drawProgresion[0] = Canvas.context.getImageData(0, 0, Canvas.canvas.width, Canvas.canvas.height)
        } else {
          Canvas.drawProgresion.push(Canvas.context.getImageData(0, 0, Canvas.canvas.width, Canvas.canvas.height));
        }
      }
    }
  }

  static changeLineSize() {
    const val = this as unknown as HTMLInputElement;
    Canvas.lineWidth = +val.value;
  }

  static changeLineColor() {
    const val = this as unknown as HTMLInputElement;
    Canvas.lineColor = val.value;
  }

  static clearCanvas() {
    if (Canvas.context && Canvas.canvas) {
      Canvas.context.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
      Canvas.drawProgresionIndex = -1;
      console.log('canvas cleaned');
      Canvas.drawProgresion = [];
    }
  }

  undoLast(): void {
    if (Canvas.canvas && Canvas.context) {
      if (Canvas.drawProgresion.length <= 1) {
        Canvas.clearCanvas();
        return;
      }
      Canvas.drawProgresionIndex--;
      Canvas.drawProgresion.pop();
      console.log(Canvas.drawProgresion[Canvas.drawProgresionIndex], 'work');
      Canvas.context.putImageData(Canvas.drawProgresion[Canvas.drawProgresionIndex], 0, 0);
    }
  }
  // ! test stuff
  static copyCurrentState(): string {
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d',
      {
        willReadFrequently: true
      }
    ) as CanvasRenderingContext2D;
    // const data = Canvas.drawProgresion[Canvas.drawProgresion.length - 1];
    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    console.log(data, 'original');
    const stringifued = JSON.stringify(data.data);
    console.log(stringifued, 'strigified');
    const parsed = JSON.parse(stringifued);
    console.log(parsed, 'parsed');
    return stringifued
  }

  static pasteOtherPainting(data: string) {
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d',
      {
        willReadFrequently: true
      }
    ) as CanvasRenderingContext2D;
    // const dadata = new ImageData({
    //   data: JSON.parse(data)
    //   colorSpace: "srgb"
    //     height: 200
    //   width: 200
    // });
    // dadata[colorSpace] = "srgb"
    // dadata[height] = 200
    // dadata[width] = 200

    context.putImageData(JSON.parse(data), 0, 0);
  }

  static saveToLocalStorage() {
    const saveBtn = document.querySelector('.toolbar__save') as HTMLElement;
    saveBtn.addEventListener('click', function save() {
      const canvasState = Canvas.copyCurrentState();
      localStorage.setItem('canv', canvasState);
    })
  }

  static testPasteFromLocalStorage() {
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d',
      {
        willReadFrequently: true
      }
    ) as CanvasRenderingContext2D;

    console.log(context);
    const pasteBtn = document.querySelector('.toolbar__info') as HTMLElement;
    pasteBtn.addEventListener('click', function paste() {
      const canvasState = JSON.parse(localStorage.getItem('canv') as string) as ImageData;
      console.log(canvasState);
      context.putImageData(canvasState, 0, 0);
    })
  }

  render() {
    this.setupCanvas();
    this.resize();
    this.giveDrawRights();

    Canvas.saveToLocalStorage();
    Canvas.testPasteFromLocalStorage();
  }
}