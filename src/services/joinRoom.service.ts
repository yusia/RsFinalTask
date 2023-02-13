import { UserModel } from '../models/user.model';
import { ConnectionService } from './connection.service';
export class JoinRoomService {
  constructor(private connectionService: ConnectionService) {}
  socket() {
    return this.connectionService.connection;
  }
  joinToRoom(renderNewPlayer: (User: UserModel[]) => void) {
    this.socket()?.on('join', (message) => {
      renderNewPlayer(message);
      // console.log(`${message} присоединился к игре`);
    });
  }
}
