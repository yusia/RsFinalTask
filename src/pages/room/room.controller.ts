import ControllerInterface from '../../interfaces/controller.interface';
import { RoomView } from './room.view'
import UsersService from '../../services/users.service';

export class RoomController implements ControllerInterface {
  constructor(private viewInstance: RoomView, private userService: UsersService) {
  }

  initView(): void {
    this.viewInstance.render({ users: this.userService.getUsers() });
  }

}