import ControllerInterface from '../../interfaces/controller.interface';
import { StartPageView } from './startPage.view';
import { ConnectionService, MessangerService, UsersService } from '../../services';
import { UserModel } from '../../models/user.model';

export class StartPageController implements ControllerInterface {
  constructor(private viewInstance: StartPageView,
    private userService: UsersService,
    private connectionService: ConnectionService,
    private messangerService: MessangerService) {

  }

  initView(): void {
    const tempUser = this.userService.getTempUser();
    this.viewInstance.render({ user: tempUser, onPlay: this.startGame.bind(this) });
  }

  startGame(user: UserModel) {
    this.saveUserSettings(user);
    this.connectionService.openConnection();
    //todo join user
    this.messangerService.newClientF(user.name);
  }

  saveUserSettings(user: UserModel) {
    this.userService.saveUserSettings(user);
    this.renderNewUser(user);
  }

  renderNewUser(user: UserModel) {
    const elem = document.getElementById('current-user') as HTMLElement;
    elem.innerHTML = `<img src="../images/${user.avatar}.png" class="thumb"><span>${user.name}</span>`;
  }
}