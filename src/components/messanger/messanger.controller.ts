import { MessangerService } from '../../services/messanger.service';
import { MessangerView } from './messanger.view';

export class MessangerController {
  constructor(private messangerView: MessangerView, private messangerServise: MessangerService) {
    this.messangerView.render();
    this.messangerServise.getHTMLElements(this.messangerView.getHTMLElements());
  }

  addEventListners() {
    const { loginButton, messageInput, messageButton, messageBody } = this.messangerView.getHTMLElements();

    loginButton.addEventListener('click', this.messangerServise.addNameToUser.bind(this.messangerServise));
    messageInput.addEventListener('input', this.messangerServise.whoTyping.bind(this.messangerServise));
    messageInput.addEventListener('keyup', this.messangerServise.sendMessage.bind(this.messangerServise));
    messageButton.addEventListener('click', this.messangerServise.sendMessage.bind(this.messangerServise));
    messageBody.addEventListener('click', this.messangerServise.removeMessege.bind(this.messangerServise));
  }

  initView(): void {
    this.messangerServise.runSockets();
    this.addEventListners();
  }
}
