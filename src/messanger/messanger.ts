import content from './messanger.html';
import { io } from 'socket.io-client';
import 'bootstrap';
interface messegeI {
  name: string;
  text: string;
}

export class Messanger {
  constructor(private messangerBody: HTMLElement) {}

  model() {
    const socket = io('http://localhost:4444');
    let name = '';
    const messages: messegeI[] = [];
    let newClient = false;
    let typingName = '';
    const inputName = document.querySelector('.message__input-name') as HTMLInputElement;
    const buttonName = document.querySelector('.message__button-name') as HTMLElement;
    const chat = document.querySelector('.message__chat') as HTMLElement;
    const inputText = document.querySelector('.message__input-text') as HTMLInputElement;
    const buttonText = document.querySelector('.message__button-text') as HTMLElement;

    const addNameToUser = (e: Event) => {
      e.preventDefault();
      name = inputName.value;
      newClientF();
    };

    buttonName.addEventListener('click', addNameToUser);

    socket.emit('findAllMessages', {}, (response: messegeI[]) => {
      messages.push(...response);

      messages.forEach((message) => addMessageTochat(chat, message));
    });

    socket.on('message', (message) => {
      console.log(message);

      messages.push(message);
      addMessageTochat(chat, message);
    });

    socket.on('typing', ({ name, isTyping }) => {
      const typingManHTML = document.querySelector('#typingMan');
      if (isTyping) {
        typingName = `${name} is typing ...`;
        console.log('gtxfnftn');
        if (!typingManHTML) this.messangerBody.append(renderTypingMan());
      } else {
        typingName = '';
        if (typingManHTML) {
          (typingManHTML as HTMLElement).remove();
        }
      }
    });

    const newClientF = () => {
      socket.emit('join', { name: name }, () => {
        newClient = true;
        return newClient;
      });
    };

    const sendMessage = (e: Event) => {
      e.preventDefault();
      socket.emit('createMessage', { text: inputText.value }, () => {
        inputText.value = '';
      });
    };

    const whoTyping = () => {
      socket.emit('typing', { isTyping: true });
      setTimeout(() => {
        socket.emit('typing', { isTyping: false });
      }, 1000);
    };

    const renderTypingMan = () => {
      const p = document.createElement('p');
      p.id = 'typingMan';
      p.classList.add('message__typing-man');
      p.textContent = typingName;
      return p;
    };
    inputText.addEventListener('input', whoTyping);
    buttonText.addEventListener('click', sendMessage);

    function addMessageTochat(messageBody: HTMLElement, message: messegeI) {
      messageBody.appendChild(handleNewMessage(message));
    }

    function handleNewMessage(message: messegeI) {
      const p = document.createElement('p');
      p.textContent = `[${message.name}]: ${message.text}`;
      return p;
    }
  }

  render() {
    this.messangerBody.innerHTML = content;
    this.model();
  }
}
