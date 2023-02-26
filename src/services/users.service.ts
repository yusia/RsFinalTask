import { Constants } from '../contants';
import { UserModel } from '../models/user.model';
import { ConnectionService } from './connection.service';

export class UsersService {
  userKey = 'usersettings';
  private currentUser!: UserModel;
  constructor(private connectionService: ConnectionService) {

    this.connectionService.connection?.on('userId', (id: string) => {
      if (!this.currentUser) {
        this.currentUser = new UserModel('', '');
      }
      this.currentUser.id = id;
    });
  }

  getUsers() {
    fetch(`${Constants.serverUrl}/users`, { mode: 'no-cors'})
      .then((response) => console.log(response));
  }

  saveUserSettings(user: UserModel) {
    this.currentUser = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getSavedUser(): UserModel | undefined {
    const userSettings = localStorage.getItem(this.userKey);
    if (userSettings) {
      const user = new UserModel('', '');
      const savedUser = JSON.parse(userSettings) as UserModel;
      user.name = savedUser.name;
      user.avatar = savedUser.avatar;
      return user;
    }
    return;
  }

  getTempUser() {
    return this.getSavedUser() || new UserModel(this.generateRandomName(), '');
  }

  getCurrentUser(): UserModel {
    return this.currentUser;
  }

  generateRandomName(): string {
    const names = ['Water Tribe', 'Earth Kingdom', 'Fire Nation', 'Foggy Swamp Tribe', 'Stories', 'Artist'];
    const index = Math.floor(Math.random() * (names.length - 1));
    return names[index];
  }
}
