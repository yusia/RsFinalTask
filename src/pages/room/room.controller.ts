import ControllerInterface from '../../../src/interfaces/controller.interface';
import { RoomView } from './room.view';
import { MessangerService, UsersService } from '../../services';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerView } from '../../components/messanger/messanger.view';
import { JoinRoomService } from '../../services/joinRoom.service';

export class RoomController implements ControllerInterface {
  constructor(
    private viewInstance: RoomView,
    private userService: UsersService,
    private messangerService: MessangerService,
    private joinRoomService: JoinRoomService
  ) {}

  initView(): void {
    this.viewInstance.render();
    //this.viewInstance.render();

    const messanger = new MessangerController(new MessangerView(), this.messangerService);
    messanger.initView();
    this.joinRoomService.joinToRoom(this.viewInstance.renderNewPlayer);
  }
}
