import ControllerInterface from '../../../src/interfaces/controller.interface';
import { RoomView } from './room.view';
import { MessangerService, ConnectionService, GameService } from '../../services';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerView } from '../../components/messanger/messanger.view';
import { CanvasLogic } from './canvasLogic';
import { UserModel, RoundModel } from '../../models';
import { ResultsModal } from '../../components/modals/results.modal';
import { ChooseWord } from '../../components/modals/chooseWord.modal';
import { FinalScore } from '../../components/modals/finalScore';
import { Constants } from '../../contants';
import { Toast } from 'bootstrap';

export class RoomController implements ControllerInterface {
  resultsModal: ResultsModal;
  finalScoremodal: FinalScore;
  canvasLogic!: CanvasLogic;

  constructor(
    private viewInstance: RoomView,
    private messangerService: MessangerService,
    public connectionService: ConnectionService,
    private gameService: GameService
  ) {
    this.addEventListners();
    this.resultsModal = new ResultsModal();
    this.finalScoremodal = new FinalScore();
  }

  addEventListners() {

    window.addEventListener('popstate', () => {
      if (history.state.title !== 'Room') {
        this.leaveRoom();
      }
    });

    window.addEventListener('chooseWord', ((event: CustomEvent) => {
      const word: string = event.detail.word;
      this.sendWordToServer(word);
    }) as EventListener);

    window.addEventListener('goNextRound', (() => {
      this.connectionService.connection?.emit('playerReadyToStartNextRound');
    }) as EventListener);

    window.addEventListener('finish-game', (() => {
      this.connectionService.connection?.emit('gameFinished');
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
    this.canvasLogic = new CanvasLogic(this.connectionService, () => {
      return this.gameService.isThisUserLead();
    });
    this.canvasLogic.render();

    const messanger = new MessangerController(new MessangerView(), this.messangerService);
    messanger.initView();
    this.listenUserChangeEvents();
    this.listenRoundEvent();
  }

  listenRoundEvent() {
    this.connectionService.connection?.on('chooseWordForRound', (Words: string[]) => {
      const modal = new ChooseWord();
      modal.showModal(Words);
    });

    this.connectionService.connection?.on('roundStarted', (model: RoundModel) => {
      this.gameService.initRound(model, this.onTimerChanged.bind(this));

      this.showWord(model.word);
      this.canvasLogic.showToolbar(this.gameService.isThisUserLead());

      this.viewInstance.setRound(model.round, model.allRounds);
      const input = this.viewInstance.buildSendWordContainer(this.gameService.isThisUserLead());
      if (input) {
        input.addEventListener('keydown', (e) => {
          this.sendWordForWin(e, input);
        });
      }
    });

    this.connectionService.connection?.on('wordForWin', (isWordTrue: boolean) => {
      this.viewInstance.rerenderWordContainer(isWordTrue);
    });

    this.connectionService.connection?.on('playerReadyToStartNextRound', () => {
      this.resultsModal.hideModal();
    });

    this.connectionService.connection?.on('roundFinished', (model: { users: UserModel[]; lead: UserModel }) => {
      this.gameService.round.lead.id = model.lead.id as string;
      const isLead = this.gameService.isThisUserLead();
      this.resultsModal.showModal(this.gameService.round.word, model.users, isLead);
      this.gameService.onRoundStop();
      this.viewInstance.setTimer(Constants.DefaultTimer);
    });
  }

  onTimerChanged(text: string, tick: number) {
    this.viewInstance.setTimer(tick);
    const wordHidden = !this.gameService.isThisUserLead();
    if (wordHidden) {
      this.viewInstance.drawWord(text);
    }
  }

  showWord(word: string) {
    const wordHidden = !this.gameService.isThisUserLead();
    const text = wordHidden
      ? word
        .split('')
        .map(() => '_')
        .join(' ')
      : word;
    this.viewInstance.buildWordContainer(text);
  }

  listenUserChangeEvents() {
    this.connectionService.connection?.on('usersLeaved', (response: { users: UserModel[] }) => {
      if (response.users.length > 1) {
        this.viewInstance.renderNewPlayer(response.users);
      } else {
        this.leaveRoom();
      }
      this.showsMessage();
    });

    this.connectionService.connection?.on('join', (message) => {
      this.viewInstance.renderNewPlayer(message);
    });

    this.connectionService.connection?.on('startTheGame', (playersCount: number) => {
      const button = this.viewInstance.renderButtonToStartGame(playersCount);
      button.addEventListener('click', this.startTheGame.bind(this));
    });

    this.connectionService.connection?.on('gameFinished', (response: { users: UserModel[] }) => {
      this.gameService.resetTimer();
      this.finalScoremodal.showModal(response.users);
    });

    this.connectionService.connection?.on('endGame', () => {
      this.finalScoremodal.hideModal();
      this.leaveRoom();
    });
  }

  startTheGame() {
    this.connectionService.connection?.emit('startTheGame');
    this.viewInstance.deleteButtonToStartGame();
  }

  leaveRoom() {
    // this.resultsModal.hideModal();
    // this.finalScoremodal.hideModal();
    this.gameService.resetTimer();
    this.redirectToHomePage();
    this.connectionService.disconnect();
  }

  redirectToHomePage() {
    history.pushState({ title: 'Home' }, 'newUrl', '/');
    window.dispatchEvent(new Event('stateChange'));
  }

  sendWordForWin(e: KeyboardEvent | Event, input: HTMLInputElement) {
    if (e instanceof KeyboardEvent && e.code === 'Enter') {
      this.connectionService.connection?.emit('wordForWin', input.value);
      input.value = '';
    }
  }

  private showsMessage() {
    const toastLiveExample = document.getElementById('information'
    ) as HTMLElement;
    const toast = new Toast(toastLiveExample);
    toast.show();
  }
}
