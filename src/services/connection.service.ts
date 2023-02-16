import { io, Socket } from 'socket.io-client';
import { Constants } from '../contants';
import { UserModel } from '../models/user.model';

export class ConnectionService {
  connection: Socket | undefined;
  constructor(private url = Constants.serverUrl) {}

  async openConnection(user: UserModel) {
    this.connection = io(this.url);
    this.connection.on('connect', () => {
      user.id = this.connection?.id as string;
    });
  }

  isConnectionOpen() {
    return !!this.openConnection;
  }
}
