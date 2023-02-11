import 'bootstrap';
import { Router, Route } from '../router';
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
    this.initCurrentUser();
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

  initCurrentUser() {
    const user = this.usersService.getSavedUser();
    if (user) {
      const elem = document.getElementById('current-user') as HTMLElement;
      elem.innerHTML = `<img src="../images/${user.avatar}" class="thumb"/>
                        <span>${user.name}</span>`;
    }
  }
}
