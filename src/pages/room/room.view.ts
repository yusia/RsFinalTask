import content from './room.html';
import { UsersComponent } from '../../components/user/userComponent';
import { Page, UserModel } from '../../models';

export class RoomView {
  setTimer(tick: number) {
    const elem = document.getElementById('timer') as HTMLDivElement;
    elem.innerHTML = tick.toString();
  }

  setRound(round: number, allRounds: number) {
    const elem = document.getElementById('round-container') as HTMLDivElement;
    elem.innerHTML = `Round: ${round}/${allRounds} `;
  }

  render() {
    const frag = this.createTemplateFromHTML(content);
    Page.appendToPage(frag);
  }

  createTemplateFromHTML(content: string): DocumentFragment {
    const div = document.createElement('div');
    div.classList.add('content');
    div.innerHTML = content;

    const frag = document.createDocumentFragment();
    frag.append(div);

    return frag;
  }

  renderNewPlayer(Users: UserModel[]) {
    const body = document.getElementById('users-container') as HTMLElement;
    body.innerHTML = '';

    const UserComponent = new UsersComponent(Users);

    body.append(UserComponent.getComponent());
  }

  drawWord(word: string) {
    const elem = document.getElementById('selected-word') as HTMLElement;
    elem.innerText = word;
  }

  buildWordContainer(word = '') {
    const elem = document.getElementById('word-container') as HTMLElement;
    elem.innerHTML = ` <span>Sketch</span>
    <span class="selected-word" id="selected-word">${word}
    </span>`;
  }
  buildSendWordContainer(isLead: boolean) {
    const elem = document.getElementById('send-word-container') as HTMLElement;
    console.log(elem);

    elem.innerHTML = '';
    if (isLead) return;
    elem.innerHTML = `<p class="send-word-text" >Send word</p>`;
    const input = document.createElement('input');
    input.classList.add('send-word-input');
    elem.append(input);
    return input;
  }
  rerenderWordContainer(isWordTrue: boolean) {
    console.log(isWordTrue);

    if (isWordTrue) {
      const elem = document.getElementById('send-word-container') as HTMLElement;
      elem.innerHTML = '';
    }
    const text = this.renderTextForWord(isWordTrue);
    if (isWordTrue) text.classList.add('winner-text');
  }

  renderTextForWord(isWordTrue: boolean) {
    let textContent = '';
    isWordTrue ? (textContent = 'You guessed the words!!!') : (textContent = 'That is not the right word');
    const elem = document.getElementById('send-word-container') as HTMLElement;
    const textContained = document.getElementById('is-word-true');
    if (textContained) {
      textContained.textContent = textContent;
      return textContained;
    } else {
      const text = document.createElement('p');
      text.classList.add('is-word-true');
      text.id = 'is-word-true';
      text.textContent = textContent;
      elem.append(text);
      return text;
    }
  }

  renderButtonToStartGame(playersCount: number) {
    const body = document.getElementById('button-to-start-game-container') as HTMLElement;
    body.innerHTML = ` <p class="text-to-start-game" >The number of players: ${playersCount}</p>`;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-success', 'my-2', 'my-lg-0', 'start-btn', 'button-to-start-game');
    button.textContent = 'Start';
    body.append(button);
    return button;
  }
  deleteButtonToStartGame() {
    const body = document.getElementById('button-to-start-game-container') as HTMLElement;
    body.innerHTML = '';
  }
}
