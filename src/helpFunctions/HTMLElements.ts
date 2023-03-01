export function isHTMLElem(element: EventTarget | null): HTMLElement {
  if (!element) throw new Error('Element was not found!');
  if (!(element instanceof HTMLElement)) throw new TypeError('Element is not HTML!');
  return element;
}
export function isHTMLInput(element: EventTarget | null): HTMLInputElement {
  if (!element) throw new Error('Element was not found!');
  if (!(element instanceof HTMLInputElement)) throw new TypeError('Element is not HTMLInput!');
  return element;
}
