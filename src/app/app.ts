import 'bootstrap';
import { Router, Route } from '../router';
import { RoomView, RoomController } from '../pages/room';
import { UsersService, MessangerService, ConnectionService } from '../services';
import { StartPageView, StartPageController } from '../pages/startPage';
import { AppView } from './app.view';

export default class App {
  usersService: UsersService;
  connectionService: ConnectionService;
  messangerService: MessangerService;
  view: AppView;

  constructor() {
    this.usersService = new UsersService();
    this.connectionService = new ConnectionService();
    this.messangerService = new MessangerService(this.connectionService);
    this.view = new AppView();
  }

  start() {
    this.initAppView();
    const router = new Router([
      new Route('',
        new StartPageController(new StartPageView(), this.usersService,this.connectionService, this.messangerService),
        true
      ),
      new Route('room',
        new RoomController(new RoomView(), this.usersService, this.messangerService)
      )
    ]);
    router.init();
  }

  initAppView() {
    this.view.render();
    this.initCurrentUser();

  }

  onLogin() {
    // temp open connection on login 
    //todo move only registration on server
  }

  initCurrentUser() {
    const user = this.usersService.getCurrentUser();
    if (user) {
      const elem = document.getElementById('current-user') as HTMLElement;
      elem.innerHTML = `<img src="../images/${user.avatar}.png" class="thumb"/>
                        <span>${user.name}</span>`;
    }
  }
}
