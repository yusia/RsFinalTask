import content from './app.html';
import 'bootstrap';
import Router from '../router/router';
import Route from '../router/route';
import RoomView from '../room/room.view';
import RoomController from '../room/room.controller';
import UsersService from '../services/users.service';

export default class App {
  private usersService: UsersService;
  constructor() {
    this.usersService = new UsersService();
  }

  render() {
    document.body.innerHTML = content;
  }

  start() {
    const router = new Router([
      new Route(
        'room',
        new RoomController(new RoomView(), this.usersService),
        true
      )
    ]);
    router.init();
  }
}