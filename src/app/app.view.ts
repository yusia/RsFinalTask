import { Page, UserModel } from '../models';
import content from './app.html';

export class AppView {


  showInprogressMessage(message: string) {
    const icon = document.querySelector('.settings-icon') as HTMLElement;
    icon.addEventListener('click', (e) => {

      const htmlElement = document.createElement('p');
      htmlElement.innerText = message;
      htmlElement.style.position = 'absolute';
      htmlElement.style.left = `${(e as MouseEvent).clientX - 40}px`;
      htmlElement.style.top = `${(e as MouseEvent).clientY + 10}px`;
      htmlElement.style.fontSize = `16px`;
      htmlElement.style.color = `white`;
      htmlElement.style.transition = 'all 0.7s ease 0s';
      htmlElement.style.opacity = '1';
      document.body.append(htmlElement);
      
      setTimeout(() => {
        if (htmlElement) {
          htmlElement.style.opacity = '0';
        }
      }, 500);

      setTimeout(() => {
        document.body.removeChild(htmlElement);
      }, 900);
    })

  }


  render(user: UserModel | undefined) {
    const frag = document.createDocumentFragment();
    frag.append(Page.createContent(content, 'app'));

    this.setUserName(frag, user);
    this.addLoginListener(frag);

    Page.appendToPage(frag, 'bodyId');
    this.showInprogressMessage('coming soon...')
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
