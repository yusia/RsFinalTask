// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...params: any[]) => void>(fn: F,  delayTime = 1000) {
  let timeoutID: number ;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delayTime);
  } as F;
}