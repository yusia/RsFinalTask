import { CanvasStep } from './../../interfaces/canvas-logic';
import { ConnectionService } from '../../services';
// import { MessangerService, UsersService, ConnectionService } from '../../services';

export class CanvasLogic {
  static isDrawing: boolean;
  static context: CanvasRenderingContext2D | undefined;
  static canvas: HTMLCanvasElement | undefined;
  static drawProgresion: ImageData[];
  static lineColor = '#acd3ed';
  static lineWidth = 7;

  public connectionService: ConnectionService;

  static oneLineCoords: { x: number, y: number }[] = [];
  static linesSteps: CanvasStep[] = [];

  constructor(private service: ConnectionService) {
    this.connectionService = service;
    CanvasLogic.isDrawing = false;

    this.connectionService.connection?.on('canvasDataChanged', (data: CanvasStep[]) => {
      // console.log(model);
      this.drowCopy2(data);
      // this.initRound(model.round);

    });
  }

  setupCanvas(): { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D } {
    const canvas = document.querySelector('.canvas-inner') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    CanvasLogic.canvas = canvas;
    CanvasLogic.context = context;
    window.addEventListener('resize', this.resize);
    return {
      canvas: CanvasLogic.canvas,
      context: CanvasLogic.context
    }
  }

  resize() {
    if (CanvasLogic.context && CanvasLogic.canvas) {
      // ! раскомменть и убери второй канвас с html, когда будет все готово
      // const canvasOuter = document.querySelector('.canvas-outer') as Element;
      // const canvasOuterWidth = window.getComputedStyle(canvasOuter).width.slice(0, -2);
      // CanvasLogic.context.canvas.width = Math.floor(+canvasOuterWidth);
      // CanvasLogic.context.canvas.height = CanvasLogic.context.canvas.width;
    }
  }

  giveDrawRights() {
    if (CanvasLogic.canvas) {
      const toolbar = document.querySelector('.toolbar__tools') as HTMLElement;
      toolbar.style.display = ''

      const clearBtn = document.querySelector('.toolbar__clear') as HTMLElement;
      clearBtn.addEventListener('click', function outerClear() {
        CanvasLogic.clearCanvas()
      });

      const undoBtn = document.querySelector('.toolbar__undo') as HTMLElement;
      undoBtn.addEventListener('click', this.undoLast);

      const lineSizeBtn = document.querySelector('.toolbar__line-width') as HTMLInputElement;
      lineSizeBtn.addEventListener('input', CanvasLogic.changeLineSize);

      const lineColorBtn = document.querySelector('.toolbar__color-all') as HTMLInputElement;
      lineColorBtn.addEventListener('input', CanvasLogic.changeLineColor);

      const downloadBtn = document.querySelector('.toolbar__download') as HTMLElement;
      downloadBtn.addEventListener('click', this.downloadPainting);

      CanvasLogic.canvas.addEventListener('mousedown', CanvasLogic.startDraw);
      CanvasLogic.canvas.addEventListener('mousemove', CanvasLogic.draw);
      CanvasLogic.canvas.addEventListener('mouseup', this.endDraw.bind(this));
      CanvasLogic.canvas.addEventListener('mouseout', this.endDraw);
      CanvasLogic.canvas.addEventListener("touchstart", CanvasLogic.startDraw);
      CanvasLogic.canvas.addEventListener("touchmove", CanvasLogic.draw);
      CanvasLogic.canvas.addEventListener("touchend", this.endDraw);
      CanvasLogic.canvas.addEventListener("touchcancel", this.endDraw);
    }
  }

  removeDrawRights() {
    if (CanvasLogic.canvas) {
      const toolbar = document.querySelector('.toolbar__tools') as HTMLElement;
      toolbar.style.display = 'none'
      CanvasLogic.canvas.removeEventListener('mousedown', CanvasLogic.startDraw);
      CanvasLogic.canvas.removeEventListener('mousemove', CanvasLogic.draw);
      CanvasLogic.canvas.removeEventListener('mouseup', this.endDraw);
      CanvasLogic.canvas.removeEventListener('mouseout', this.endDraw);

      CanvasLogic.canvas.removeEventListener("touchstart", CanvasLogic.startDraw);
      CanvasLogic.canvas.removeEventListener("touchmove", CanvasLogic.draw);
      CanvasLogic.canvas.removeEventListener("touchend", this.endDraw);
      CanvasLogic.canvas.removeEventListener("touchcancel", this.endDraw);
    }
  }

  static startDraw() {
    CanvasLogic.isDrawing = true;
    CanvasLogic.oneLineCoords = [];
  }

  static draw(e: MouseEvent | TouchEvent): { x: number, y: number } {

    if (!CanvasLogic.isDrawing) {
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

      CanvasLogic.oneLineCoords.push({
        x: pointerX,
        y: pointerY
      })

      return {
        x: pointerX,
        y: pointerY
      }
    }
    return {
      x: -1,
      y: -1
    }
  }

  endDraw(e: MouseEvent | TouchEvent) {
    CanvasLogic.isDrawing = false;
    if (CanvasLogic.context && CanvasLogic.canvas) {

      CanvasLogic.context.beginPath();

      if (e.type !== 'mouseout' || (e as MouseEvent).buttons == 1) {
        const step: CanvasStep = {
          coords: CanvasLogic.oneLineCoords,
          lineWidth: CanvasLogic.lineWidth,
          strokeStyle: CanvasLogic.lineColor,
        }
        CanvasLogic.linesSteps.push(step);
        this.connectionService.connection?.emit('canvasShare', CanvasLogic.linesSteps);
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

  static clearCanvas(otherCanvas?: HTMLCanvasElement) {
    if (otherCanvas) {
      otherCanvas.getContext('2d')?.clearRect(0, 0, otherCanvas.width, otherCanvas.height);
      return
    }
    if (CanvasLogic.context && CanvasLogic.canvas) {
      CanvasLogic.context.clearRect(0, 0, CanvasLogic.canvas.width, CanvasLogic.canvas.height);
      CanvasLogic.linesSteps = [];
    }
  }

  undoLast(): void {
    if (CanvasLogic.canvas && CanvasLogic.context) {
      if (CanvasLogic.linesSteps.length <= 1) {
        CanvasLogic.clearCanvas();
        return;
      }

      CanvasLogic.linesSteps.pop();
      CanvasLogic.context.clearRect(0, 0, CanvasLogic.canvas.width, CanvasLogic.canvas.height);
      CanvasLogic.linesSteps.forEach(el => CanvasLogic.drawFromLinesSteps(CanvasLogic.canvas as HTMLCanvasElement, el))
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

  static drawFromLinesSteps(yourCanvas: HTMLCanvasElement, step: CanvasStep): void {

    const context = yourCanvas.getContext('2d') as CanvasRenderingContext2D;

    context.lineWidth = step.lineWidth ?? 0;
    context.strokeStyle = step.strokeStyle ?? 'red';
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.beginPath();

    step.coords.forEach((elem) => {
      context.lineTo(elem.x, elem.y);
    })
    context.stroke();
    context.beginPath();
  }

  static drowCopy() {
    const canvas = document.querySelectorAll('.canvas-inner')[1] as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    setInterval(() => {
      if (!CanvasLogic.linesSteps.length) {
        CanvasLogic.clearCanvas(canvas);
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      CanvasLogic.linesSteps.forEach(el => CanvasLogic.drawFromLinesSteps(canvas, el))
    }, 500)
  }

  drowCopy2(array: CanvasStep[]) {
    const canvas = document.querySelectorAll('.canvas-inner')[1] as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (!CanvasLogic.linesSteps.length) {
      CanvasLogic.clearCanvas(canvas);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    array.forEach(el => CanvasLogic.drawFromLinesSteps(canvas, el))
  }

  render() {
    this.setupCanvas();
    this.resize();
    this.giveDrawRights();

    // CanvasLogic.drowCopy()

  }
}