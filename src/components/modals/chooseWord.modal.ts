import { Modal } from 'bootstrap';
import { isHTMLElem } from '../../helpFunctions/HTMLElements';

export class ChooseWord {
  private modal!: Modal;
  showModal(Words: string[]) {
    this.createModal(Words);
    this.modal = new Modal('#chooseWordModal');
    this.modal.show();
  }

  private createModal(Words: string[]) {
    const modalResults = document.getElementById('chooseWordBody') as HTMLElement;
    modalResults.innerHTML = '';

    modalResults.innerHTML = `  <p>Choose Word!</p>
                                <ul class="choose-word-container"> 
                                    <li class="choose-word-for-game">${Words[0]}</li> 
                                    <li class="choose-word-for-game">${Words[1]}</li> 
                                    <li class="choose-word-for-game">${Words[2]}</li> 
                                </ul>`;

    const chooseWordButtons = modalResults.querySelectorAll('.choose-word-for-game');
    chooseWordButtons.forEach((button) => {
      button.addEventListener('click', (e: Event) => {
        window.dispatchEvent(
          new CustomEvent('chooseWord', {
            detail: { word: isHTMLElem(e.currentTarget).textContent },
          })
        );
        this.modal.hide();
      });
    });
  }
}
