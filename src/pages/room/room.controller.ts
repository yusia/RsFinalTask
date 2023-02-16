import ControllerInterface from '../../../src/interfaces/controller.interface';
import { RoomView } from './room.view';
import { MessangerService, UsersService, ConnectionService } from '../../services';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerView } from '../../components/messanger/messanger.view';
import { UserModel } from '../../models';
import { ResultsModal } from '../../components/modals/results.modal';

export class RoomController implements ControllerInterface {
  round: { number: number, intervalId: NodeJS.Timer | undefined, timerId: NodeJS.Timeout | undefined }
  constructor(
    private viewInstance: RoomView,
    private userService: UsersService,
    private messangerService: MessangerService,
    private connectionService: ConnectionService
  ) {
    this.round = {
      number: 1,
      intervalId: undefined,
      timerId: undefined,
    }
  }

  initView(): void {
    this.viewInstance.render();

    const messanger = new MessangerController(new MessangerView(), this.messangerService);
    messanger.initView();
    this.listenUserChangeEvents();
    this.listenRoundEvent();
  }

  onRoundStop() {
    this.resetTimer();
  }

  listenRoundEvent() {

    this.connectionService.connection?.on('turnStarted', (model: { round: number, lead: UserModel }) => {
      console.log(model);
      this.initRound(model.round);
    });

    this.connectionService.connection?.on('roundFinished', (model: { users: UserModel[] }) => {
      const modal = new ResultsModal();
      modal.showModal(model.users);
      this.onRoundStop();
    });

  }

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


  listenUserChangeEvents() {
    this.connectionService.connection?.on('usersLeaved', (response: { users: UserModel[] }) => {
      this.viewInstance.renderNewPlayer(response.users);
    });

    this.connectionService.connection?.on('join', (message) => {
      this.viewInstance.renderNewPlayer(message);
    });
  }
}
