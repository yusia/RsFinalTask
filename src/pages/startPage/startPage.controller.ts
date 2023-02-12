import ControllerInterface from '../../interfaces/controller.interface';
import { StartPageView } from './startPage.view';
import UsersService from '../../services/users.service';
import { UserModel } from '../../models/user.model';

export class StartPageController implements ControllerInterface {
  constructor(private viewInstance: StartPageView, private userService: UsersService) {

  }

  initView(): void {
    const tempUser = this.userService.getCurrentUser();
    this.viewInstance.render({ user: tempUser, onStartPlay: this.saveUserSettings.bind(this) });
  }

  saveUserSettings(user: UserModel) {
    this.userService.saveUserSettings(user);
    this.setCurrentUser(user);
  }

  setCurrentUser(user: UserModel) {
    const elem= document.getElementById('current-user') as HTMLElement;
    elem.innerHTML = `<img src="../images/${user.avatar}" class="thumb"><span>${user.name}</span>`;
  }
}