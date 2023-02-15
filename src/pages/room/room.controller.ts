import ControllerInterface from '../../../src/interfaces/controller.interface';
import { RoomView } from './room.view';
import { MessangerService, UsersService } from '../../services';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerView } from '../../components/messanger/messanger.view';
import { JoinRoomService } from '../../services/joinRoom.service';
import { UserModel } from '../../models';

export class RoomController implements ControllerInterface {
  round: { number: number, intervalId: NodeJS.Timer | undefined, timerId: NodeJS.Timeout | undefined }
  constructor(
    private viewInstance: RoomView,
    private userService: UsersService,
    private messangerService: MessangerService,
    private joinRoomService: JoinRoomService
  ) {
    this.round = {
      number: 1,
      intervalId: undefined,
      timerId: undefined,
    }
  }

  initView(): void {
    this.viewInstance.render();
    //this.viewInstance.render();

    const messanger = new MessangerController(new MessangerView(), this.messangerService);
    messanger.initView();
    this.joinRoomService.joinToRoom(this.viewInstance.renderNewPlayer);
    this.listenRoundEvent();
    //todo into connection
  }
  onRoundStop() {
    this.resetTimer();
    alert("Time is over");
  }

  listenRoundEvent() {
 
    this.joinRoomService.socket()?.on('roundStarted', (model: { round: number, lead: UserModel }) => {
      console.log(model);
      this.initRound(model.round);
    });

    this.joinRoomService.socket()?.on('roundFinished', (model: { round: number, lead: UserModel }) => {
      console.log(model);

      this.initRound(model.round);
      this.onRoundStop();
    });

  }

  //for next turn restart timer
  //for next round change round number and restart timer

  initRound(round: number) {
    let startTime = 90;

    this.round.intervalId = setInterval(() => {
      this.viewInstance.setTimer(startTime);
      startTime--;
    }, 1000);

    this.round.timerId = setTimeout(() => {
      this.onRoundStop();
      const tempround = round + 1;
      this.viewInstance.setRound(tempround);
    }, 10000);
  }

  resetTimer() {
    clearInterval(this.round.intervalId);
    clearTimeout(this.round.timerId);
  }
  
}
