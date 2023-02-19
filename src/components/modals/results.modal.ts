import { Modal } from 'bootstrap';
import { UserModel } from '../../models';

export class ResultsModal {
  private modal!: Modal;
  showModal(word: string, users: UserModel[]) {
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

  private bindNextRoundClick() {
    const btn = document.getElementById('next-round-btn');
    btn?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('goNextRound'));
      this.modal.hide();
    });
  }
}
