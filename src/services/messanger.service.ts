import { ChatElements } from '../interfaces/messenger.elements';
import { io } from 'socket.io-client';
import { messageI } from '../interfaces/messageI';
import { isHTMLElem } from '../helpFunctions/HTMLElements';
const socket = io('http://localhost:4444');

export class MessangerService {
  static HTMLElements: ChatElements;
  name: string;
  messages: messageI[];
  newClient: boolean;
  typingName: string;
  socket;

  constructor() {
    this.name = '';
    this.messages = [];
    //
    this.newClient = false;
    //
    this.typingName = '';
    this.socket = io('http://localhost:4444');
  }

  runSockets() {
    const chat = MessangerService.HTMLElements.chat;
    console.log(socket);

    const messangerBody = MessangerService.HTMLElements.messageBody;

    socket.emit('findAllMessages', {}, (response: messageI[]) => {
      this.messages.push(...response);
      this.messages.forEach((message) => this.addMessageTochat(chat, message));
    });

    socket.on('message', (message) => {
      this.messages.push(message);
      this.addMessageTochat(chat, message);
    });

    socket.on('typing', ({ name, isTyping }) => {
      const typingManHTML = document.querySelector('#typingMan');
      if (isTyping) {
        this.typingName = `${name} is typing ...`;
        if (!typingManHTML) messangerBody.append(this.renderTypingMan());
      } else {
        this.typingName = '';
        if (typingManHTML) {
          (typingManHTML as HTMLElement).remove();
        }
      }
    });

    socket.on('removeMessage', (messageArr: messageI[] | -1) => {
      if (messageArr === -1) return;
      this.messages.splice(0, this.messages.length + 1, ...messageArr);
      console.log(this.messages);

      chat.innerHTML = '';
      this.messages.forEach((message) => this.addMessageTochat(chat, message));
      //this.messages.push(message);
      //this.addMessageTochat(chat, message);
    });
  }

  addNameToUser(e: Event) {
    e.preventDefault();
    const InputName = MessangerService.HTMLElements.loginInput;
    this.name = InputName.value;
    InputName.value = '';
    this.newClientF();
  }

  newClientF() {
    socket.emit('join', { name: this.name }, () => {
      this.newClient = true;
      return this.newClient;
    });
  }

  sendMessage(e: KeyboardEvent | Event) {
    e.preventDefault();
    if (e instanceof KeyboardEvent && e.code !== 'Enter') return;

    const inputMessage = MessangerService.HTMLElements.messageInput;
    socket.emit('createMessage', { text: inputMessage.value }, () => {
      inputMessage.value = '';
    });
  }

  whoTyping() {
    socket.emit('typing', { isTyping: true });
    setTimeout(() => {
      socket.emit('typing', { isTyping: false });
    }, 2000);
  }

  renderTypingMan() {
    const p = document.createElement('p');
    p.id = 'typingMan';
    p.classList.add('message__typing-man');
    p.textContent = this.typingName;
    return p;
  }

  removeMessege(e: Event) {
    const target = isHTMLElem(e.target);
    if (!target.classList.contains('message__current-message-menu-options-delite')) return;

    const messageElement = target.parentElement?.parentElement?.parentElement as HTMLElement;

    const message = isHTMLElem(messageElement.childNodes[0]);

    const textOfElement = message.textContent as string;
    const indexOfStart = textOfElement.search(/:/);
    const messageText = textOfElement.slice(indexOfStart + 2);
    socket.emit('removeMessage', messageText);
    //
  }

  addMessageTochat(messageBody: HTMLElement, message: messageI) {
    const textElement = this.handleNewMessage(message);
    messageBody.appendChild(textElement);
    messageBody.scrollTop += textElement.clientHeight * 2;
  }

  handleNewMessage(message: messageI) {
    const li = document.createElement('li');
    li.classList.add('message__current-message');

    const messageText = document.createElement('p');
    messageText.classList.add('message__current-message-text');
    messageText.textContent = `[${message.name}]: ${message.text}`;

    const menuContainer = document.createElement('div');
    menuContainer.classList.add('message__current-message-menu-container');

    const menu = document.createElement('div');
    menu.classList.add('message__current-message-menu');
    menuContainer.append(menu);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('message__current-message-menu-options');
    menuContainer.append(optionsContainer);

    const deliteOption = document.createElement('p');
    deliteOption.classList.add('message__current-message-menu-options-delite');
    deliteOption.textContent = 'delite';
    optionsContainer.append(deliteOption);

    li.append(messageText);
    li.append(menuContainer);

    return li;
  }

  showMessageOptions(e: Event) {
    const target = isHTMLElem(e.target);
    if (!target.classList.contains('message__current-message-menu')) return;
    target.classList.toggle('active-menu');

    const options = isHTMLElem(target.nextSibling);
    options.classList.toggle('activ-options');
  }

  getHTMLElements(elements: ChatElements): void {
    MessangerService.HTMLElements = elements;
    console.log(MessangerService.HTMLElements);
  }
}
