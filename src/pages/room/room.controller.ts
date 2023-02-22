import ControllerInterface from '../../../src/interfaces/controller.interface';
import { RoomView } from './room.view';
import { MessangerService, UsersService, ConnectionService } from '../../services';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerView } from '../../components/messanger/messanger.view';

import { CanvasLogic } from './canvasLogic';

import { UserModel, RoundModel, RoundViewModel } from '../../models';
import { ResultsModal } from '../../components/modals/results.modal';
import { ChooseWord } from '../../components/modals/chooseWord.modal';
import { Constants } from '../../contants';

export class RoomController implements ControllerInterface {
  resultsModal: ResultsModal;
  round: RoundViewModel;

  constructor(
    private viewInstance: RoomView,
    private userService: UsersService,
    private messangerService: MessangerService,
    public connectionService: ConnectionService
  ) {

    this.round = {
      lead: new UserModel('',''),
      round: 1,
      intervalId: undefined,
      timerId: undefined,
      word: '',
      allPlayers: []
    };

    this.addEventListners();
    this.resultsModal = new ResultsModal();
  }

  addEventListners() {
    window.addEventListener('chooseWord', ((event: CustomEvent) => {
      const word: string = event.detail.word;
      this.sendWordToServer(word);
    }) as EventListener);

    window.addEventListener('goNextRound', (() => {
      this.connectionService.connection?.emit('playerReadyToStartNextRound');
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
    const canvasLogic = new CanvasLogic(this.connectionService, () => { return this.userService.isThisUserLead(this.round.lead.id); });
    canvasLogic.render();

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

    this.connectionService.connection?.on('roundStarted', (model: RoundModel) => {
      this.round.lead = model.lead;
      this.round.round = model.round;
      this.round.word = model.word;
      this.initRound(model);

      const input = this.viewInstance.buildSendWordContainer(this.userService.isThisUserLead(this.round.lead.id));
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
      this.round.lead.id = model.lead.id as string;
      const isLead = this.userService.isThisUserLead(this.round.lead.id);
      this.resultsModal.showModal(this.round.word, model.users, isLead);
      this.onRoundStop();
    });
  }


  initRound(model: RoundModel) {
    let startTime = 90;
    const wordHidden = !this.userService.isThisUserLead(this.round.lead.id);
    this.showWord(wordHidden, model.word);

    let word = model.word
      .split('')
      .map(() => '_')
      .join('');
    this.round.intervalId = setInterval(() => {
      this.viewInstance.setTimer(startTime);
      if (wordHidden) {
        word = this.showLetter(startTime, word, model.word);
      }
      startTime--;
    }, 1000);

    this.setRoundTimer(model.round);
  }

  setRoundTimer(round: number) {
    this.round.timerId = setTimeout(() => {
      this.onRoundStop();
      const tempround = round + 1;
      this.viewInstance.setRound(tempround);
    }, Constants.DefaultTimer * 10000);
  }

  showLetter(startTime: number, word: string, initWord: string): string {
    switch (startTime) {
      case 60: {
        const i = word.length - 1;
        return this.getTipAndDraw(i, word, initWord);
      }
      case 40: {
        const i = Math.round(word.length / 2);
        return this.getTipAndDraw(i, word, initWord);
      }
      case 30:
        if (word.length > 6) {
          const i = Math.round(word.length / 2) - 1;
          return this.getTipAndDraw(i, word, initWord);
        }
        break;
      case 10:
        if (word.length > 3) {
          const i = 0;
          return this.getTipAndDraw(i, word, initWord);
        }
        break;
    }

    return word;
  }

  getTipAndDraw(i: number, word: string, initWord: string) {
    const letters = word.split('').map((l, index) => (i === index ? initWord.split('')[index] : l));
    const fillWord = letters.join('');
    const text = letters.join(' ');
    this.viewInstance.drawWord(text);
    return fillWord;
  }

  showWord(wordHidden: boolean, word: string) {
    const text = wordHidden
      ? word
        .split('')
        .map(() => '_')
        .join(' ')
      : word;
    this.viewInstance.buildWordContainer(text);
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

    this.connectionService.connection?.on('startTheGame', (playersCount: number) => {
      const button = this.viewInstance.renderButtonToStartGame(playersCount);
      button.addEventListener('click', this.startTheGame.bind(this));
    });
  }

  startTheGame() {
    this.connectionService.connection?.emit('startTheGame');
    this.viewInstance.deleteButtonToStartGame();
    //
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
}
