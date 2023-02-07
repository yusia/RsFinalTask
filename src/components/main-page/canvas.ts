import content from './main-page.html'
export default class Canvas {

 static render() {
    const main = document.body.querySelector('#main') as HTMLElement;
    main.innerHTML = content;
  }
}