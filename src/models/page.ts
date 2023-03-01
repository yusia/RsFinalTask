export class Page {

  static appendToPage(doc: DocumentFragment, elementId = 'content') {
    const main = document.getElementById(elementId) as HTMLDivElement;
    main.innerHTML = '';
    main.appendChild(doc);
  }

  static createContent(content: string, cssClass = 'inner-container'): HTMLElement {
    const div = document.createElement('div');
    if(cssClass)  div.classList.add(cssClass);
    div.innerHTML = content;
    return div;
  }
}