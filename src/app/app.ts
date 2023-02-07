import content from './app.html';
import 'bootstrap';
import Canvas from './../components/main-page/canvas'

const canv = new Canvas()
export default class App {
  render() {
    document.body.innerHTML = content;
    canv.render()
  }
}