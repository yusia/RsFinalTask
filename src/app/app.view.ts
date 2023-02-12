import { Page } from '../models';
import content from './app.html';

export class AppView {

  render() {
    const frag = document.createDocumentFragment();
    frag.append(Page.createContent(content,'app'));

    // this.setUserName(frag);


    this.addLoginListener(frag);
    
    Page.appendToPage(frag,'bodyId');
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
