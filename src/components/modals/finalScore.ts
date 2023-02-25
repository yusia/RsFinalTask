import { Modal } from 'bootstrap';
import { UserModel } from '../../models';

export class FinalScore {
  private modal!: Modal;
  showModal(users: UserModel[]) {
    console.log(7777777777);

    this.createModal(users);
    this.modal = new Modal('#FinalScoreModal');
    this.modal.show();
  }

  private createModal(users: UserModel[]) {
    const modalResults = document.getElementById('finalScore') as HTMLElement;
    modalResults.innerHTML = '';
    let result = ``;
    users.forEach((user, index) => {
      result += `
                  <div class="d-flex justify-content-between">
                    <div>Position ${index}: </div>
                    <div> 
                      <img src="../images/${user.avatar}.png" class="thumb" /><span>${user.name}</span>
                    </div> 
                    <div class="current-score"> ${user.currentScore} </div>
                </div>`;
    });
    modalResults.innerHTML = result;
    this.bindNextRoundClick();
  }

  hideModal() {
    this.modal.hide();
  }

  private bindNextRoundClick() {
    const btn = document.getElementById('finish-game');
    btn?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('finish-game'));
      this.modal.hide();
    });
  }
}
