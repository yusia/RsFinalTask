import { UserModel, Page } from '../../models';
import content from './startPage.html';

export class StartPageView {
  private user: UserModel;

  constructor() {
    this.user = new UserModel('', '');
  }

  render(model: { user: UserModel; onPlay: (newUser: UserModel) => void }) {
    this.user = model.user;
    const frag = document.createDocumentFragment();
    frag.append(Page.createContent(content));

    this.setUserName(frag);
    this.loadGaleryAvatars(frag);
    this.setDefaultAvatar(frag);

    this.addStartListener(frag, model.onPlay);
    this.addGaleryListener(frag);
    Page.appendToPage(frag);
  }

  setUserName(doc: DocumentFragment) {
    const input = doc.getElementById('user-name') as HTMLInputElement;
    input.addEventListener('change', () => {
      this.user.name = this.getUserName(); //todo get from e.target
    });
    input.value = this.user.name;
  }

  getUserName(): string {
    const input = document.getElementById('user-name') as HTMLInputElement;
    return input.value;
  }

  loadGaleryAvatars(doc: DocumentFragment) {
    const avatarsIds = [1, 2, 3, 4];
    const galery = doc.getElementById('avatars_galery') as HTMLDivElement;
    galery.innerHTML = '';
    avatarsIds.forEach((avatarId) => {
      galery.append(this.buildImage(avatarId));
    });
  }

  buildImage(avatarId: number): HTMLImageElement {
    const img = document.createElement('img');
    img.src = `../images/${avatarId}.png`;
    img.dataset.id = `${avatarId}`;
    img.classList.add('avatar_thumb');
    return img;
  }

  setDefaultAvatar(doc: DocumentFragment) {
    const avatar = doc.getElementById('selected-avatar') as HTMLImageElement;
    const defaultAvatar = '3';
    this.user.avatar = this.user?.avatar || defaultAvatar;
    avatar.src = `../images/${this.user.avatar}.png`;
  }

  addStartListener(doc: DocumentFragment, onStartPlay: (newUser: UserModel) => void) {
    doc.getElementById('start-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      onStartPlay(this.user);
      this.goToRoom();
    });
  }

  goToRoom() {
    history.pushState({ title: 'Your game' }, 'newUrl', '/room');
    window.dispatchEvent(new Event('stateChange'));
  }

  addGaleryListener(doc: DocumentFragment) {
    const bigImage = doc.getElementById('selected-avatar') as HTMLImageElement;
    doc.getElementById('avatars_galery')?.addEventListener('click', (e: MouseEvent) => {
      const img = e.target as HTMLImageElement;
      if (img.src !== undefined) {
        bigImage.src = img.src;
        if (img.dataset.id) {
          this.user.avatar = img.dataset.id;
        }
      }
    });
  }
}
