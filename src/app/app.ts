import 'bootstrap';
import Router from '../router/router';
import Route from '../router/route';
import RoomView from '../room/room.view';
import RoomController from '../room/room.controller';
import UsersService from '../services/users.service';

import { StartPageView, StartPageController } from '../startPage';

export default class App {
  private usersService: UsersService;
  constructor() {
    this.usersService = new UsersService();
  }

  start() {
    const router = new Router([
      new Route(
        '',
        new StartPageController(new StartPageView()),
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