
import { Constants } from '../contants';
import { UserModel, RoundViewModel, RoundModel } from '../models';
import { UsersService } from './users.service';

export class GameService {
  round: RoundViewModel;

  constructor(
    private userService: UsersService,
  ) {
    this.round = {
      lead: new UserModel('', ''),
      round: 1,
      intervalId: undefined,
      timerId: undefined,
      word: '',
      allPlayers: []
    }
  }

  initRound(model: RoundModel, onTimerChanged: (text: string, tick: number) => void) {
    this.round.lead = model.lead;
    this.round.round = model.round;
    this.round.word = model.word;

    let startTime = Constants.DefaultTimer;

    let word = model.word
      .split('')
      .map(() => '_')
      .join('');

    this.round.intervalId = setInterval(() => {
  
        word = this.showLetter(startTime, word, model.word, onTimerChanged);
      
      startTime--;
    }, 1000);

    this.setRoundTimer();
  }

  isThisUserLead() {
    return this.userService.getCurrentUser().id === this.round.lead.id;
  }

  showLetter(startTime: number, word: string, initWord: string, onTimerChanged: (text: string, tick: number) => void): string {
    let letters = word.split('');
    switch (startTime) {
      case 60: {
        const i = word.length - 1;
        letters = this.getTipLetters(i, word, initWord);
        break;
      }
      case 45: {
        const i = Math.round(word.length / 2);
        letters = this.getTipLetters(i, word, initWord);
        break
      }
      case 30:
        if (word.length > 6) {
          const i = Math.round(word.length / 2) - 1;
          letters = this.getTipLetters(i, word, initWord);
        }
        break;
      case 20:
        if (word.length > 3) {
          const i = 0;
          letters = this.getTipLetters(i, word, initWord);
        }
        break;
      default: word = letters.join('');
    }
    onTimerChanged(letters.join(' '), startTime);
    return letters.join('');
  }

  getTipLetters(i: number, word: string, initWord: string): string[] {
   return word.split('').map((l, index) => (i === index ? initWord.split('')[index] : l));
  }

  setRoundTimer() {
    this.round.timerId = setTimeout(() => {
      this.onRoundStop();
    }, Constants.DefaultTimer * 10000);
  }

  resetTimer() {
    clearInterval(this.round.intervalId);
    clearTimeout(this.round.timerId);
  }

  onRoundStop() {
    this.resetTimer();
  }
}

