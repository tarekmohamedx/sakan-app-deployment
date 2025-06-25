import { Injectable, Signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { MessageDto } from '../../../core/models/messageDto';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ChatHubService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new Subject<MessageDto>();
  private connectionStatusSubject = new Subject<boolean>();

  message$ = this.messageSubject.asObservable();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  receiverID: string = '';

  startConnection(userId: string) {
    console.log(`Starting SignalR connection for user: ${userId}`);
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:44392/chat?userId=${userId}`)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection established');
        this.connectionStatusSubject.next(true);
      })
      .catch(err => {
        console.error('Error establishing SignalR connection:', err);
        this.connectionStatusSubject.next(false);
      });

      this.hubConnection.on('ReceiveMessage', (messageDto: MessageDto) => {
        console.log('Received message:', messageDto);
        this.messageSubject.next(messageDto);
      });
  }

  public async sendMessage(message: MessageDto) {
    try {
      console.log(message);
      await this.hubConnection.invoke('SendMessage', message);
    } catch (error) {
      console.error('Error sending message through SignalR:', error);
      throw error;
    }
  }

  stopConnection() {
    this.hubConnection?.stop();
  }

  constructor() { }
}
