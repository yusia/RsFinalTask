// import { doc } from 'prettier';
export * from './room.controller';
export * from './room.view';
import content from './room.html';

export class CanvasLogic {
  public isDrawing: boolean;
  static context: CanvasRenderingContext2D | undefined;
  static canvas: HTMLCanvasElement | undefined;
  static drawProgresion: ImageData[];
  static drawProgresionIndex: number;
  static lineColor = '#fcd3fd';
  // static lineColor = '#acd3ed';
  static lineWidth = 10;
  startX: number;
  startY: number;
  // !test
  static XNYList: { x: number, y: number }[] = [{ x: 0, y: 0 }];

  constructor() {
    this.isDrawing = false;
    this.startX = 2;
    this.startY = 2;
    CanvasLogic.drawProgresionIndex = -1;

  }

  setupCanvas(): { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D } {
    const mainHtml = document.body.querySelector('#main') as HTMLElement;
    mainHtml.innerHTML = content;
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    CanvasLogic.canvas = canvas;
    CanvasLogic.context = context;
    // window.addEventListener('resize', this.resize);
    return {
      canvas: CanvasLogic.canvas,
      context: CanvasLogic.context
    }
  }

  resize() {
    if (CanvasLogic.context && CanvasLogic.canvas) {
      const canvasOuter = document.querySelector('.canvas-outer') as Element;
      const canvasOuterWidth = window.getComputedStyle(canvasOuter).width.slice(0, -2);
      console.log(Math.floor(+canvasOuterWidth));
      // console.log(window.getComputedStyle(canvasOuter).width);
      CanvasLogic.context.canvas.width = Math.floor(+canvasOuterWidth);

      CanvasLogic.context.canvas.height = CanvasLogic.context.canvas.width;
      console.log('resized');
      // CanvasLogic.context.canvas.width = Number(window.getComputedStyle(CanvasLogic.canvas).width);
      // CanvasLogic.context.canvas.height = Number(window.getComputedStyle(CanvasLogic.canvas).height);
    }
  }

  giveDrawRights() {
    if (CanvasLogic.canvas) {
      const clearBtn = document.querySelector('.toolbar__clear') as HTMLElement;
      clearBtn.addEventListener('click', CanvasLogic.clearCanvas);

      const undoBtn = document.querySelector('.toolbar__undo') as HTMLElement;
      undoBtn.addEventListener('click', this.undoLast);

      const lineSizeBtn = document.querySelector('.toolbar__line-width') as HTMLInputElement;
      lineSizeBtn.addEventListener('input', CanvasLogic.changeLineSize);

      const lineColorBtn = document.querySelector('.toolbar__color-all') as HTMLInputElement;
      lineColorBtn.addEventListener('input', CanvasLogic.changeLineColor);

      const downloadBtn = document.querySelector('.toolbar__download') as HTMLElement;
      downloadBtn.addEventListener('click', this.downloadPainting);

      CanvasLogic.canvas.addEventListener('mousedown', this.startDraw);
      CanvasLogic.canvas.addEventListener('mousemove', this.draw);
      CanvasLogic.canvas.addEventListener('mouseup', this.endDraw);
      CanvasLogic.canvas.addEventListener('mouseout', this.endDraw);
      CanvasLogic.canvas.addEventListener("touchstart", this.startDraw);
      CanvasLogic.canvas.addEventListener("touchmove", this.draw);
      CanvasLogic.canvas.addEventListener("touchend", this.endDraw);
      CanvasLogic.canvas.addEventListener("touchcancel", this.endDraw);
    }
  }

  removeDrawRights() {
    if (CanvasLogic.canvas) {
      CanvasLogic.canvas.removeEventListener('mousedown', this.startDraw);
      CanvasLogic.canvas.removeEventListener('mousemove', this.draw);
      CanvasLogic.canvas.removeEventListener('mouseup', this.endDraw);
      CanvasLogic.canvas.removeEventListener('mouseout', this.endDraw);

      CanvasLogic.canvas.removeEventListener("touchstart", this.startDraw);
      CanvasLogic.canvas.removeEventListener("touchmove", this.draw);
      CanvasLogic.canvas.removeEventListener("touchend", this.endDraw);
      CanvasLogic.canvas.removeEventListener("touchcancel", this.endDraw);
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
    if (CanvasLogic.canvas && CanvasLogic.context) {
      // CanvasLogic.context.beginPath()
      // const canvasOffsetX = CanvasLogic.canvas.offsetLeft;
      // const canvasOffsetY = CanvasLogic.canvas.offsetTop;
      // const pointerX = (e as MouseEvent).clientX - canvasOffsetX
      // const pointerY = (e as MouseEvent).clientY - canvasOffsetY
      // CanvasLogic.context.moveTo(pointerX, pointerY)
      // CanvasLogic.context.beginPath();
      // CanvasLogic.context.lineTo(this.startX, this.startY)
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

    if (CanvasLogic.canvas && CanvasLogic.context) {
      const canvasOffsetX = CanvasLogic.canvas.offsetLeft;
      const canvasOffsetY = CanvasLogic.canvas.offsetTop;
      CanvasLogic.context.lineWidth = CanvasLogic.lineWidth;
      CanvasLogic.context.strokeStyle = CanvasLogic.lineColor;
      CanvasLogic.context.lineCap = 'round';
      CanvasLogic.context.lineJoin = 'round';

      let pointerX = (e as MouseEvent).clientX - canvasOffsetX
      let pointerY = (e as MouseEvent).clientY - canvasOffsetY
      if ((e as TouchEvent).changedTouches) {
        pointerX = (e as TouchEvent).changedTouches[0].clientX - canvasOffsetX
        pointerY = (e as TouchEvent).changedTouches[0].clientY - canvasOffsetY
      }
      CanvasLogic.context.lineTo(pointerX, pointerY);
      CanvasLogic.context.stroke();

      // !
      CanvasLogic.XNYList.push({ x: pointerX, y: pointerY });
      // console.log(CanvasLogic.XNYList[CanvasLogic.XNYList.length - 1]);
      // console.log(CanvasLogic.XNYList.length);
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
    if (CanvasLogic.context && CanvasLogic.canvas) {
      CanvasLogic.context.beginPath();
      if (e.type !== 'mouseout') {
        CanvasLogic.drawProgresionIndex++;
        if (CanvasLogic.drawProgresion === undefined) {
          CanvasLogic.drawProgresion = [];
          CanvasLogic.drawProgresion[0] = CanvasLogic.context.getImageData(0, 0, CanvasLogic.canvas.width, CanvasLogic.canvas.height)
        } else {
          CanvasLogic.drawProgresion.push(CanvasLogic.context.getImageData(0, 0, CanvasLogic.canvas.width, CanvasLogic.canvas.height));
        }
      }
    }
  }

  static changeLineSize() {
    const val = this as unknown as HTMLInputElement;
    CanvasLogic.lineWidth = +val.value;
  }

  static changeLineColor() {
    const val = this as unknown as HTMLInputElement;
    CanvasLogic.lineColor = val.value;
  }

  static clearCanvas() {
    if (CanvasLogic.context && CanvasLogic.canvas) {
      CanvasLogic.context.clearRect(0, 0, CanvasLogic.canvas.width, CanvasLogic.canvas.height);
      CanvasLogic.drawProgresionIndex = -1;
      CanvasLogic.drawProgresion = [];
    }
  }

  undoLast(): void {
    if (CanvasLogic.canvas && CanvasLogic.context) {
      if (CanvasLogic.drawProgresion.length <= 1) {
        CanvasLogic.clearCanvas();
        return;
      }
      CanvasLogic.drawProgresionIndex--;
      CanvasLogic.drawProgresion.pop();
      console.log(CanvasLogic.drawProgresion[CanvasLogic.drawProgresionIndex], 'work');
      CanvasLogic.context.putImageData(CanvasLogic.drawProgresion[CanvasLogic.drawProgresionIndex], 0, 0);
    }
  }

  downloadPainting(): void {
    if (CanvasLogic.canvas && CanvasLogic.context) {
      const link = document.createElement('a');
      link.download = 'game-painting.png';
      link.href = CanvasLogic.canvas.toDataURL('image/png');
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

    const lastPoint = CanvasLogic.XNYList[CanvasLogic.XNYList.length - 1];
    console.log(lastPoint);
    setInterval(() => {

      // context.beginPath();
      const lastPoint = CanvasLogic.XNYList[CanvasLogic.XNYList.length - 1]
      // const preLastPoint = CanvasLogic.XNYList[CanvasLogic.XNYList.length - 2]
      // const previousX = CanvasLogic.XNYList[CanvasLogic.XNYList.length - 1].x
      // const previousy = CanvasLogic.XNYList[CanvasLogic.XNYList.length - 1].y

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
      const canvasState = CanvasLogic.copyCurrentState();
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
    // CanvasLogic.pasteOtherPainting()
    // CanvasLogic.saveToLocalStorage();
    // CanvasLogic.testPasteFromLocalStorage();
  }
}