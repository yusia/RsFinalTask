import { Modal } from 'bootstrap';
import { UserModel } from '../../models';

export class ResultsModal {
  private modal!: Modal;
  showModal(word: string, users: UserModel[], lead: boolean) {
    this.addButtonToNexnRoundForLead(lead);
    this.createModal(word, users);
    this.modal = new Modal('#roundResultsModal');
    this.modal.show();
  }

  private createModal(word: string, users: UserModel[]) {
    const modalResults = document.getElementById('roundResults') as HTMLElement;
    modalResults.innerHTML = '';
    let result = `<div class="result-word">Word was ${word}</div>`;
    users.forEach((user) => {
      result += `
                  <div class="d-flex justify-content-between">
                    <div> 
                      <img src="../images/${user.avatar}.png" class="thumb" /><span>${user.name}</span>
                    </div> 
                    <div class="current-score"> ${user.currentScore} </div>
                </div>`;
    });
    modalResults.innerHTML = result;
    this.bindNextRoundClick();
  }
  private addButtonToNexnRoundForLead(lead: boolean) {
    const body = document.getElementById('modal-winners-container') as HTMLElement;
    if (!lead) {
      const modalFooter = document.getElementById('modal-winners-footer');
      if (modalFooter) modalFooter.remove();
      return;
    }
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-footer');
    buttonContainer.id = 'modal-winners-footer';
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-primary');
    button.id = 'next-round-btn';
    button.textContent = 'Next round';
    buttonContainer.append(button);

    body.append(buttonContainer);
  }
  hideModal() {
    this.modal.hide();
  }

  private bindNextRoundClick() {
    const btn = document.getElementById('next-round-btn');
    btn?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('goNextRound'));
      this.modal.hide();
    });
  }
}
