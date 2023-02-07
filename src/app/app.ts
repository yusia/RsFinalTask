import content from './app.html';
import 'bootstrap';
import Canvas from './../components/main-page/canvas'

export default class App {
  render() {
    document.body.innerHTML = content;
    Canvas.render()
  }
}