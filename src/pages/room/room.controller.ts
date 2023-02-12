import ControllerInterface from '../../../src/interfaces/controller.interface';
import { RoomView } from './room.view';
import { MessangerService, UsersService } from '../../services';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerView } from '../../components/messanger/messanger.view';
import { CanvasLogic } from './index';
export class RoomController implements ControllerInterface {
  constructor(private viewInstance: RoomView, private userService: UsersService, private messangerService: MessangerService) { }

  initView(): void {
    this.viewInstance.render({ users: this.userService.getUsers() });
    const canvasLogic = new CanvasLogic;
    canvasLogic.render();
    const messanger = new MessangerController(new MessangerView(), this.messangerService);
    messanger.initView();

  }
}
