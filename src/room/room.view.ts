import ViewInterface from "../interfaces/view.interface";
import content from './room.html';

export class RoomView implements ViewInterface{

  render() {
    document.body.innerHTML = content;
  }
}