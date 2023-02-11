export class Page{
  appendToBody(doc: DocumentFragment) {
    const id = "content";
    const main = document.getElementById(id) as HTMLDivElement;
    main.innerHTML = '';
    main.appendChild(doc);
  }

  createContent(content: string): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('inner-container');
    div.innerHTML = content;
    return div;
  }
}