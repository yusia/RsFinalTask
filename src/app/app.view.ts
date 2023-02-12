import { Page, UserModel } from '../models';
import content from './app.html';

export class AppView {

  render(user: UserModel | undefined) {
    const frag = document.createDocumentFragment();
    frag.append(Page.createContent(content, 'app'));

    this.setUserName(frag, user);
    this.addLoginListener(frag);

    Page.appendToPage(frag, 'bodyId');
  }

  setUserName(doc: DocumentFragment, user: UserModel | undefined) {
    if (user) {
      const elem = document.getElementById('current-user') as HTMLElement;
      elem.innerHTML = `<img src="../images/${user.avatar}.png" class="thumb"/>
                        <span>${user.name}</span>`;
    }
  }
  addLoginListener(doc: DocumentFragment) {

    console.log(doc);
    // setUserName(doc: DocumentFragment) {
    //   const input = doc.getElementById('user-name') as HTMLInputElement;
    //   input.value = this.user.name;
    // }
  }
  goToRoom() {
    history.pushState({ title: 'Your game' }, 'newUrl', '/room');
    window.dispatchEvent(new Event('stateChange'));
  }

}
