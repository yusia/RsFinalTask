import { MessangerService } from '../../services/messanger.service';
import { MessangerView } from './messanger.view';

export class MessangerController {
  constructor(private messangerView: MessangerView, private messangerService: MessangerService) {
    this.messangerView.render();
    this.messangerService.getHTMLElements(this.messangerView.getHTMLElements());
  }

  addEventListners() {
    const {  messageInput, messageButton, messageBody } = this.messangerView.getHTMLElements();

    messageInput.addEventListener('input', this.messangerService.whoTyping.bind(this.messangerService));
    messageInput.addEventListener('keyup', this.messangerService.sendMessage.bind(this.messangerService));
    messageButton.addEventListener('click', this.messangerService.sendMessage.bind(this.messangerService));
    messageBody.addEventListener('click', this.messangerService.removeMessege.bind(this.messangerService));
    messageBody.addEventListener('click', this.messangerService.showMessageOptions.bind(this.messangerService));
  }

  initView(): void {
    this.messangerService.runSockets();
    this.addEventListners();
  }
}
