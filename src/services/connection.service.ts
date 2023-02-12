import { io, Socket } from 'socket.io-client';
import { Constants } from '../contants';

export class ConnectionService {
  connection: Socket | undefined;
  constructor(private url = Constants.serverUrl) {
  }

  openConnection() {
    this.connection = io(this.url);
  }
  
  isConnectionOpen() {
    return !!this.openConnection;
  }
}