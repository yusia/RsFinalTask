import content from './room.html';
import { UsersComponent } from '../../components/user/userComponent';
import { MessangerController } from '../../components/messanger/messanger.controller';
import { MessangerService } from '../../services/messanger.service';
import { MessangerView } from '../../components/messanger/messanger.view';
import {Page} from '../../models';

export class RoomView extends Page {
  render(model: { users: string[] }) {
    const frag = this.createTemplateFromHTML(content);
    
    this.addUsers(frag, model.users);
    
    this.appendToBody(frag);

    const messanger = new MessangerController(new MessangerView(), new MessangerService());
    messanger.initView();
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
