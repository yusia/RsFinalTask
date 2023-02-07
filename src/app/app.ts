import content from './app.html';
import { Messanger } from '../messanger/messanger';
import 'bootstrap';

export default class App {
  render() {
    document.body.innerHTML = content;
    const messangerBody = document.querySelector('#main') as HTMLElement;
    const messanger = new Messanger(messangerBody);
    messanger.render();
  }
}
