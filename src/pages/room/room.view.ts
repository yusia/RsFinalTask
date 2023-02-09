import content from './room.html';
import { UsersComponent } from '../../components/user/userComponent'

export class RoomView {
  render(model: { users: string[] }) {
    const frag = this.createTemplateFromHTML(content);
    
    this.addUsers(frag, model.users);

    document.body.innerHTML = "";
    document.body.append(frag);
  }

  addUsers(fragment: DocumentFragment, users: string[]) {
    const userList = fragment.getElementById('users-container');
    const UserComponent = new UsersComponent(users);
    userList?.append(UserComponent.getComponent());
  }

  createTemplateFromHTML(content: string): DocumentFragment {
    const div = document.createElement('div');
    div.classList.add('content');
    div.innerHTML = content;

    const frag = document.createDocumentFragment();
    frag.append(div);
    return frag;
  }

}