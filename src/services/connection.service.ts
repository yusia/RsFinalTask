import { io, Socket } from 'socket.io-client';
import { Constants } from '../contants';

export class ConnectionService {
  connection: Socket | undefined;
  constructor(private url = Constants.serverUrl) { }

  async openConnection(): Promise<string> {
    this.connection = io(this.url);
    return this.listenConnection();
  }

  async listenConnection(): Promise<string> {
    return new Promise((resolve) => {
      this.connection?.on('connect', () => {
        resolve(this.connection?.id || '');
      });
    });
  }

  isConnectionOpen() {
    return this.connection?.connected;
  }

  disconnect() {
    this.connection?.emit('usersLeaved');
  }
}
