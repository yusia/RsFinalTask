import { UserModel } from "../models/user.model";

export default class UsersService {
  userKey = "usersettings";
  getUsers(): string[] {
    return ['user1', 'user2', 'user3']
  }

  saveUserSettings(user: UserModel) {
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

  getCurrentUser(): UserModel {
    return this.getSavedUser() || new UserModel(this.generateRandomName(), '');
  }

  generateRandomName(): string {
    const names = ['Water Tribe', 'Earth Kingdom', 'Fire Nation', 'Foggy Swamp Tribe', 'Stories', 'Artist'];
    const index = Math.floor(Math.random() * (names.length - 1));
    return names[index];
  }
}