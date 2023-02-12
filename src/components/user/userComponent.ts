

class UsersComponent {
  constructor(private users: string[]) {
  }

  private userTmp = (userName: string) => `
              <div class="user">${userName}</div>`;
              
  getComponent() {
    return this.createList(this.users);
  }

  createList(users: string[]) {
    const divContainer = document.createElement('div');
    divContainer.classList.add('user-list', 'column');
    users.forEach((userName) => {
      const div = document.createElement('div');
      div.innerHTML = this.userTmp(userName);
      divContainer.appendChild(div);
    });
    return divContainer;
  }
}

export { UsersComponent };