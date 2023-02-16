export class UserModel {
  id: number | string;
  currentScore: number;

  constructor(public name: string, public avatar: string) {
    this.id = -1;
    this.currentScore = 0;
  }
}
