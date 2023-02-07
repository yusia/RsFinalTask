import content from './app.html';
import 'bootstrap';

export default class App {
  render() {
    document.body.innerHTML = content;
  }

  start() {
    console.log("change view");
  }
}