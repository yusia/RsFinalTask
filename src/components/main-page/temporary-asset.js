const canvas = document.querySelector('.canvas');
const canvasOuter = document.querySelector('.canvas-outer');
const ctx = canvas.getContext('2d', {
  willReadFrequently: true
});
const toolbarColor = document.querySelector('.toolbar__color');
const toolbarLineWidth = document.querySelector('.toolbar__line-width');
const toolbarClear = document.querySelector('.toolbar__clear');
const toolbarUndo = document.querySelector('.toolbar__undo');

const toolbarInfo = document.querySelector('.toolbar__info');

// https://www.color-hex.com/popular-colors.php

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
console.log(canvasOuter.canvasOffsetY);

canvas.height = window.innerWidth - canvasOffsetX;
canvas.width = window.innerHeight - canvasOffsetY;
// console.log(canvas.height);
// console.log(canvas.width);
console.log(canvasOuter.getBoundingClientRect().width);
// canvas.height = canvasOuter.offsetWidth - canvasOffsetX;
// canvas.width = canvasOuter.offsetHeight - canvasOffsetY;

canvas.height = canvasOuter.getBoundingClientRect().height;
canvas.width = canvasOuter.getBoundingClientRect().width;

// canvas.height = 20
// canvas.width = 20
let isPainting = false;

let startX;
let startY;

let drawProgresion = [];
let progrIndex = -1;

canvas.addEventListener('mousedown', prepareDraw)
canvas.addEventListener('touchstart', prepareDraw)

canvas.addEventListener('mousemove',  draw)
canvas.addEventListener('touchmove', draw)

canvas.addEventListener('mouseup', stopDraw)
canvas.addEventListener('touchend', stopDraw)

canvas.addEventListener('mouseout', stopDraw)

toolbarUndo.addEventListener('click', undoLast)
toolbarClear.addEventListener('click', clearCanvas);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawProgresion = [];
  progrIndex = -1;
}

function undoLast() {
  if (drawProgresion.length <= 1) {
    clearCanvas();
    return;
  }
  progrIndex--;
  drawProgresion.pop();
  ctx.putImageData(drawProgresion[progrIndex], 0, 0);
}
function prepareDraw(event) {
  isPainting = true;
  startX = event.clientX;
  startY = event.clientY;
  event.preventDefault();
}

function draw(event) {
  if (!isPainting) {
    return;
  }
  ctx.lineWidth = toolbarLineWidth.value;
  ctx.strokeStyle = toolbarColor.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineTo(event.clientX - canvasOffsetX, event.clientY - canvasOffsetY);
  ctx.stroke();
}

function stopDraw(event) {
  isPainting = false;

  ctx.beginPath();
  if (event.type !== 'mouseout') {
    progrIndex++;
    drawProgresion.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    console.log(drawProgresion);
  }

}

