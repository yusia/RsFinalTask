import content from './startPage.html';

export class StartPageView {

  render() {
    const frag = document.createDocumentFragment();
    frag.append(this.createContent());
    this.addStartListener(frag);
    document.body.innerHTML = "";
    document.body.append(frag);
  }

  createContent(): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('content');
    div.innerHTML = content;
    return div;
  }

  addStartListener(doc: DocumentFragment) {
    doc.getElementById('start-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.goToRoom();
    });
  }
  
  goToRoom(){
    history.pushState({title:'Your game'}, 'newUrl', '/room');
    history.go();
    history.forward();
  }
}
