import { UserModel } from './user.model';


export type RoundModel = {
  round: number;
  lead: UserModel;
  allPlayers: UserModel[];
  word: string;
};
