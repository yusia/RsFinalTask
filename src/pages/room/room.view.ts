import content from './room.html';
import { UsersComponent } from '../../components/user/userComponent';
import { Page, UserModel } from '../../models';

export class RoomView {
  setTimer(tick: number) {
    const elem = document.getElementById('timer') as HTMLDivElement;
    elem.innerHTML = tick.toString();
  }

  setRound(round: number) {
    const elem = document.getElementById('round-container') as HTMLDivElement;
    elem.innerHTML = round.toString();
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
  buildSendWordContainer(isLead: () => boolean) {
    const elem = document.getElementById('send-word-container') as HTMLElement;
    console.log(elem);

    elem.innerHTML = '';
    if (isLead()) return;
    elem.innerHTML = `<p class="send-word-text" >Send word</p>`;
    const input = document.createElement('input');
    input.classList.add('send-word-input');
    elem.append(input);
    return input;
  }
}
