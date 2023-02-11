import { UserModel } from "../models/user.model";

export default class UsersService {
  userKey = "usersettings";
  getUsers(): string[] {
    return ['user1', 'user2', 'user3']
  }

  saveUserSettings(user: UserModel) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getCurrentUser(): UserModel {
    const user = new UserModel('', '');

    const userSettings = localStorage.getItem(this.userKey);
    if (userSettings) {
      const savedUser = JSON.parse(userSettings) as UserModel;
      user.name = savedUser.name;
      user.avatar = savedUser.avatar;
    } else {
      user.name = this.generateRandomName()
    }
    return user;
  }

  generateRandomName(): string {
    const names = ['Water Tribe', 'Earth Kingdom', 'Fire Nation', 'Foggy Swamp Tribe', 'Stories', 'Artist'];
    const index = Math.floor(Math.random() * (names.length - 1));
    return names[index];
  }
}