import { UserModel } from './user.model';

export type RoundModel = {
  round: number;
  lead: UserModel;
  allPlayers: UserModel[];
  word: string;
  allRounds: number;
};
export type RoundViewModel = RoundModel & {
  intervalId: NodeJS.Timer | undefined;
  timerId: NodeJS.Timeout | undefined;
};
