import 'bootstrap';
import Router from '../router/router';
import Route from '../router/route';
import { RoomView, RoomController } from '../pages/room';
import UsersService from '../services/users.service';
import { StartPageView, StartPageController } from '../pages/startPage';
import content from './app.html';

export default class App {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  render() {
    document.body.innerHTML = content;
  }

  start() {
    this.render();
    const router = new Router([
      new Route(
        '',
        new StartPageController(new StartPageView(), this.usersService),
        true
      ),
      new Route(
        'room',
        new RoomController(new RoomView(), this.usersService)
      )
    ]);
    router.init();
  }
}
