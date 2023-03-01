import 'bootstrap';
import { Router, Route } from '../router';
import { RoomView, RoomController } from '../pages/room';
import { UsersService, MessangerService, ConnectionService, GameService } from '../services';
import { StartPageView, StartPageController } from '../pages/startPage';
import { AppView } from './app.view';

// const canv = new Canvas()
export default class App {
  usersService: UsersService;
  connectionService: ConnectionService;
  messangerService: MessangerService;
  view: AppView;
  gameService: GameService;

  constructor() {
    this.connectionService = new ConnectionService();
    this.usersService = new UsersService(this.connectionService);
    this.messangerService = new MessangerService(this.connectionService);
    this.gameService = new GameService(this.usersService);
    this.view = new AppView();
    this.usersService.getUsers(); //just to wake up server
    this.onUnload();
  }

  start() {
    this.initAppView();
    const router = new Router([
      new Route(
        '',
        new StartPageController(new StartPageView(), this.usersService, this.connectionService, this.messangerService),
        true
      ),
      new Route(
        'room',
        new RoomController(new RoomView(), this.messangerService, this.connectionService, this.gameService)
      ),
    ]);
    router.init();
  }

  initAppView() {
    const user = this.usersService.getCurrentUser();
    this.view.render(user);
  }

  onLogin() {
    // temp open connection on login
    //todo move only registration on server
  }

  onUnload() {
    window.addEventListener('beforeunload', (event) => {
      if (this.connectionService.isConnectionOpen()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.returnValue = 'Would you like to leave the game?';
      }
    });
    window.addEventListener('unload', (event) => {
      if (this.connectionService.isConnectionOpen()) {
        this.connectionService.disconnect();
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    });
  }
}
