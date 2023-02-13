import { UserModel } from '../../models';

class UsersComponent {
  constructor(private users: UserModel[]) {}

  private userTmp = (user: UserModel) => `
              <div class="user-original">${user.name}</div>
              <div class="user-img-container">
                  <img src="../images/${user.avatar}.png" class="user-img" />
              </div>
              `;

  getComponent() {
    return this.createList(this.users);
  }

  createList(users: UserModel[]) {
    const divContainer = document.createElement('div');
    divContainer.classList.add('user-list', 'column');
    users.forEach((user) => {
      const div = document.createElement('div');
      div.classList.add('one-user-container');
      div.innerHTML = this.userTmp(user);
      divContainer.appendChild(div);
    });
    return divContainer;
  }
}

export { UsersComponent };
