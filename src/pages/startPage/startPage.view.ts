import { UserModel } from '../../models/user.model';
import content from './startPage.html';

export class StartPageView {
  private user: UserModel | undefined;
  constructor() {
    this.user = undefined;
  }
  render(model: { user: UserModel }) {
    this.user = model.user;
    const frag = document.createDocumentFragment();
    frag.append(this.createContent());
    this.addStartListener(frag);
    this.addGaleryListener(frag);
    console.log(model);
    this.loadAvatars(frag);
    this.setDefaultAvatar(frag);
    document.body.innerHTML = "";
    document.body.append(frag);
  }

  loadAvatars(doc: DocumentFragment) {
    //getImages
    //build to img 
    //insert to document
    const avatar = doc.getElementById('selected-avatar') as HTMLImageElement;
    avatar.src = `../../../assets/images/avatars/${this.user?.avatar}.png`;
  }

  setDefaultAvatar(doc: DocumentFragment) {
    const avatar = doc.getElementById('selected-avatar') as HTMLImageElement;
    const defaultAvatar = '3';
    avatar.src = `../../../assets/images/avatars/${this.user?.avatar || defaultAvatar}.png`;
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


  goToRoom() {
    history.pushState({ title: 'Your game' }, 'newUrl', '/room');
    history.go();
    history.forward();
  }


  addGaleryListener(doc: DocumentFragment) {
    const bigImage = doc.getElementById("selected-avatar") as HTMLImageElement;
    doc.getElementById("avatars_galery")?.addEventListener('click', (e: MouseEvent) => {
      const img = e.target as HTMLImageElement;
      if (img.src !== undefined) {
        bigImage.src = img.src;
        console.log("selected avatar", img.dataset.id)
      }
    });
  }
}
