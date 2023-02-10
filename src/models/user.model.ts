export class UserModel {
  private id: number;
  constructor(public name: string, public avatar: string) {
    this.id = -1;
  }
}