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
  // !test
  static XNYList: { x: number, y: number }[] = [{ x: 0, y: 0 }];

  constructor() {
    this.isDrawing = false;
    this.startX = 2;
    this.startY = 2;
    Canvas.drawProgresionIndex = -1;

  }

  setupCanvas(): { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D } {
    const mainHtml = document.body.querySelector('#main') as HTMLElement;
    mainHtml.innerHTML = content;
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    Canvas.canvas = canvas;
    Canvas.context = context;
    return {
      canvas: Canvas.canvas,
      context: Canvas.context
    }
  }

  resize() {
    if (Canvas.context && Canvas.canvas) {
      // Canvas.context.canvas.width = 200;
      // Canvas.context.canvas.height = 200;
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

      const downloadBtn = document.querySelector('.toolbar__download') as HTMLElement;
      downloadBtn.addEventListener('click', this.downloadPainting);

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
      Canvas.canvas.removeEventListener('mousedown', this.startDraw);
      Canvas.canvas.removeEventListener('mousemove', this.draw);
      Canvas.canvas.removeEventListener('mouseup', this.endDraw);
      Canvas.canvas.removeEventListener('mouseout', this.endDraw);

      Canvas.canvas.removeEventListener("touchstart", this.startDraw);
      Canvas.canvas.removeEventListener("touchmove", this.draw);
      Canvas.canvas.removeEventListener("touchend", this.endDraw);
      Canvas.canvas.removeEventListener("touchcancel", this.endDraw);
    }
  }

  startDraw(e: MouseEvent | TouchEvent) {
    this.isDrawing = true;

    // this.startX = (e as TouchEvent).changedTouches ?
    //   (e as TouchEvent).changedTouches[0].clientX :
    //   (e as MouseEvent).clientX;
    // this.startY = (e as TouchEvent).changedTouches ?
    //   (e as TouchEvent).changedTouches[0].clientY :
    //   (e as MouseEvent).clientY;
    if (Canvas.canvas && Canvas.context) {
      // Canvas.context.beginPath()
      // const canvasOffsetX = Canvas.canvas.offsetLeft;
      // const canvasOffsetY = Canvas.canvas.offsetTop;
      // const pointerX = (e as MouseEvent).clientX - canvasOffsetX
      // const pointerY = (e as MouseEvent).clientY - canvasOffsetY
      // Canvas.context.moveTo(pointerX, pointerY)
      // Canvas.context.beginPath();
      // Canvas.context.lineTo(this.startX, this.startY)
    }
    e.preventDefault();
  }

  draw(e: MouseEvent | TouchEvent): { x: number, y: number } {
    if (!this.isDrawing) {
      return {
        x: -1,
        y: -1
      }
    }

    if (Canvas.canvas && Canvas.context) {
      const canvasOffsetX = Canvas.canvas.offsetLeft;
      const canvasOffsetY = Canvas.canvas.offsetTop;
      Canvas.context.lineWidth = Canvas.lineWidth;
      Canvas.context.strokeStyle = Canvas.lineColor;
      Canvas.context.lineCap = 'round';
      Canvas.context.lineJoin = 'round';

      let pointerX = (e as MouseEvent).clientX - canvasOffsetX
      let pointerY = (e as MouseEvent).clientY - canvasOffsetY
      if ((e as TouchEvent).changedTouches) {
        pointerX = (e as TouchEvent).changedTouches[0].clientX - canvasOffsetX
        pointerY = (e as TouchEvent).changedTouches[0].clientY - canvasOffsetY
      }
      Canvas.context.lineTo(pointerX, pointerY);
      Canvas.context.stroke();

      // !
      Canvas.XNYList.push({ x: pointerX, y: pointerY });
      // console.log(Canvas.XNYList[Canvas.XNYList.length - 1]);
      // console.log(Canvas.XNYList.length);
      return {
        x: pointerX,
        y: pointerY
      }
    }

    return {
      x: 0,
      y: 0
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
    // !time
    // console.time('start');

    // for (let i = 0; i < Canvas.drawProgresion[0].data.length; i++) {
    //   // i++
    //   continue
    // }
    // console.timeEnd('start');
    // console.log('ended');

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

  downloadPainting(): void {
    if (Canvas.canvas && Canvas.context) {
      const link = document.createElement('a');
      link.download = 'game-painting.png';
      link.href = Canvas.canvas.toDataURL('image/png');
      link.click();
    }
  }
  // ! test stuff
  static copyCurrentState(): string {
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    console.log(data, 'original');
    const stringifued = JSON.stringify(data.data);
    console.log(stringifued, 'strigified');
    const parsed = JSON.parse(stringifued);
    console.log(parsed, 'parsed');
    return stringifued
  }

  static pasteOtherPainting() {
    const canvas = document.querySelectorAll('.canvas-inner')[1] as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const lastPoint = Canvas.XNYList[Canvas.XNYList.length - 1];
    console.log(lastPoint);
    setInterval(() => {

      // context.beginPath();
      const lastPoint = Canvas.XNYList[Canvas.XNYList.length - 1]
      // const preLastPoint = Canvas.XNYList[Canvas.XNYList.length - 2]
      // const previousX = Canvas.XNYList[Canvas.XNYList.length - 1].x
      // const previousy = Canvas.XNYList[Canvas.XNYList.length - 1].y

      // context.moveTo(preLastPoint.x, preLastPoint.y)
      context.beginPath()
      const xx = lastPoint.x
      const yy = lastPoint.y
      context.lineWidth = 6;
      context.strokeStyle = 'red';
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineTo(xx, yy);
      context.stroke();
      context.closePath()

    }, 0)

    // context.putImageData(JSON.parse(data), 0, 0);
  }

  saveToLocalStorage() {
    const saveBtn = document.querySelector('.toolbar__save') as HTMLElement;
    saveBtn.addEventListener('click', function save() {
      const canvasState = Canvas.copyCurrentState();
      localStorage.setItem('canv', canvasState);
    })
  }

  static testPasteFromLocalStorage() {
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

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
    Canvas.pasteOtherPainting()
    // Canvas.saveToLocalStorage();
    Canvas.testPasteFromLocalStorage();
  }
}