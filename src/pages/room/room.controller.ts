import ControllerInterface from '../../../src/interfaces/controller.interface';
import { RoomView } from './room.view';
import { MessangerService, UsersService, ConnectionService } from '../../services';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerView } from '../../components/messanger/messanger.view';
import { UserModel } from '../../models';

export class RoomController implements ControllerInterface {
  round: { number: number; intervalId: NodeJS.Timer | undefined; timerId: NodeJS.Timeout | undefined };
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
    };
  }

  initView(): void {
    this.viewInstance.render();
    //this.viewInstance.render();

    const messanger = new MessangerController(new MessangerView(), this.messangerService);
    messanger.initView();
    this.listenUserChangeEvents();
    this.listenRoundEvent();
    //todo into connection
  }
  onRoundStop() {
    this.resetTimer();
    alert('Time is over');
  }

  listenRoundEvent() {
    this.connectionService.connection?.on(
      'roundStarted',
      (model: { round: number; currentLead: UserModel; allPlayers: UserModel[] }) => {
        console.log(model.currentLead);
        console.log(model.round);
        this.viewInstance.renderNewPlayer(model.allPlayers, model.currentLead);


        this.initRound(model.round);
      }
    );

    this.connectionService.connection?.on('roundFinished', (model: { round: number; currentLead: UserModel }) => {
      console.log(8888);

      this.initRound(model.round);

      this.connectionService.connection?.emit('roundStarted');

      this.onRoundStop();
    });
  }

  //for next turn restart timer
  //for next round change round number and restart timer

  initRound(round: number) {
    let startTime = 90;
    console.log(`raund` + round);

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
