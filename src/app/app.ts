import 'bootstrap';
import { Router, Route } from '../router';
import { RoomView, RoomController } from '../pages/room';
import { UsersService, MessangerService, ConnectionService, JoinRoomService } from '../services';
import { StartPageView, StartPageController } from '../pages/startPage';
import { AppView } from './app.view';

export default class App {
  usersService: UsersService;
  connectionService: ConnectionService;
  messangerService: MessangerService;
  joinRoomService: JoinRoomService;
  view: AppView;

  constructor() {
    this.usersService = new UsersService();
    this.connectionService = new ConnectionService();
    this.messangerService = new MessangerService(this.connectionService);
    this.joinRoomService = new JoinRoomService(this.connectionService);
    this.view = new AppView();
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
        new RoomController(new RoomView(), this.usersService, this.messangerService, this.connectionService)
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
        event.returnValue ='Would you like to leave the game?';
        return 'Would you like to leave the game?';
      }
    });
    window.addEventListener('unload', (event) => {
      if (this.connectionService.isConnectionOpen()) {
        this.connectionService.connection?.emit('usersLeaved');
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    })
  }
}
