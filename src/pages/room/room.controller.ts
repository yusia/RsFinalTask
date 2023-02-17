import ControllerInterface from '../../../src/interfaces/controller.interface';
import { RoomView } from './room.view';
import { MessangerService, UsersService, ConnectionService } from '../../services';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerView } from '../../components/messanger/messanger.view';
import { UserModel } from '../../models';
import { ResultsModal } from '../../components/modals/results.modal';
import { ChooseWord } from '../../components/modals/chooseWord.modal';

export class RoomController implements ControllerInterface {
  userId: string;
  LeadId: string;
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
    this.LeadId = '-1';
    this.userId = '';
    this.addEventListners();
  }

  addEventListners() {
    window.addEventListener('chooseWord', ((event: CustomEvent) => {
      const word: string = event.detail.word;
      this.sendWordToServer(word);
    }) as EventListener);
  }
  sendWordToServer(word: string) {
    this.connectionService.connection?.emit('wordIsChosen', word);
  }

  initView(): void {
    if (this.connectionService.isConnectionOpen()) {
      this.renderView();
    } else {
      this.redirectToHomePage();
    }
  }

  renderView() {
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
    this.connectionService.connection?.on('chooseWordForRound', (Words: string[]) => {
      const modal = new ChooseWord();
      modal.showModal(Words);
    });

    this.connectionService.connection?.on(
      'roundStarted',
      (model: { round: number; lead: UserModel; allPlayers: UserModel[]; word: string }) => {
        this.LeadId = model.lead.id as string;

        this.initRound(model.round);
      }
    );

    this.connectionService.connection?.on('roundFinished', (model: { users: UserModel[] }) => {
      const modal = new ResultsModal();
      modal.showModal(model.users);
      this.onRoundStop();
    });
  }
  isThisUserLead() {
    return this.userId === this.LeadId;
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

    this.connectionService.connection?.on('userId', (id: string) => {
      this.userId = id;
    });

    this.connectionService.connection?.on('join', (message) => {
      this.viewInstance.renderNewPlayer(message);
    });
  }

  redirectToHomePage() {
    history.pushState({ title: 'Home' }, 'newUrl', '/');
    window.dispatchEvent(new Event('stateChange'));
  }
}
