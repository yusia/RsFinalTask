import { UserModel } from "../models/user.model";

export class UsersService {
  userKey = "usersettings";
  private currentUser: UserModel | undefined;

  getUsers(): string[] {
    return ['user1', 'user2', 'user3']
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

  getCurrentUser(): UserModel | undefined {
    return this.currentUser;
  }

  generateRandomName(): string {
    const names = ['Water Tribe', 'Earth Kingdom', 'Fire Nation', 'Foggy Swamp Tribe', 'Stories', 'Artist'];
    const index = Math.floor(Math.random() * (names.length - 1));
    return names[index];
  }
}