import content from './messanger.html';
import { isHTMLElem } from '../../helpFunctions/HTMLElements';
import { isHTMLInput } from '../../helpFunctions/HTMLElements';
import { ChatElements } from '../../interfaces/messenger.elements';
import { Page } from '../../models';

export class MessangerView {
  body: HTMLElement;
  constructor() {
    this.body = isHTMLElem(document.querySelector('.chat'));
  }
  getHTMLElements(): ChatElements {
    const elements: ChatElements = {
      chat: isHTMLElem(this.body.querySelector('.message__chat')),
      messageInput: isHTMLInput(this.body.querySelector('.message__input-text')),
      messageButton: isHTMLElem(this.body.querySelector('.message__button-text')),
      messageMenu: isHTMLElem(this.body.querySelector('.message__button-text')),
      messageBody: this.body,
    };
    return elements;
  }

  render() {
    const frag = document.createDocumentFragment();
    frag.append(Page.createContent(content));
    Page.appendToPage(frag, 'chat');
  }
}
