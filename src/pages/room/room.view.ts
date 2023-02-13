import content from './room.html';
import { UsersComponent } from '../../components/user/userComponent';
import { Page, UserModel } from '../../models';

export class RoomView {
  render() {
    const frag = this.createTemplateFromHTML(content);

    //this.addUsers(frag, model.users);

    Page.appendToPage(frag);
  }

  //addUsers(fragment: DocumentFragment, users: UserModel[]) {
  //  const userList = fragment.getElementById('users-container');
  //  const UserComponent = new UsersComponent(users);
  //  userList?.append(UserComponent.getComponent());
  //}

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
    console.log(body);

    const UserComponent = new UsersComponent(Users);

    body.append(UserComponent.getComponent());
  }
}
