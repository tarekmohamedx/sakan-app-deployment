import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { MessageDto, MessageModel } from '../../../core/models/messageDto';

@Injectable({
  providedIn: 'root'
})
export class ChatHubService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new Subject<MessageModel>();
  private connectionStatusSubject = new Subject<boolean>();
  private connectionPromise: Promise<void> | null = null;

  message$ = this.messageSubject.asObservable();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  // Ensure connection is established before sending messages
  public async ensureConnection(): Promise<void> {
    // Return if already connected
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    // Only start one connection attempt at a time
    if (!this.connectionPromise) {
      this.connectionPromise = this.hubConnection.start()
        .then(() => {
          console.log('SignalR connection established');
          this.connectionStatusSubject.next(true);
        })
        .catch(err => {
          console.error('Error establishing SignalR connection:', err);
          this.connectionStatusSubject.next(false);
          throw err;
        })
        .finally(() => this.connectionPromise = null);
    }

    return this.connectionPromise;
  }

  public async sendMessage(message: MessageDto): Promise<void> {
    try {
      await this.ensureConnection();
      await this.hubConnection.invoke('SendMessage', message);
    } catch (error) {
      console.error('Error sending message through SignalR:', error);
      throw error;
    }
  }

  startConnection(userId: string) {
    console.log(`Starting SignalR connection for user: ${userId}`);
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7188/chat?userId=${userId}`)
      .withAutomaticReconnect() // Add automatic reconnect
      .build();

      this.hubConnection.on('ReceiveMessage', (message: MessageModel) => {
        message.timestamp = new Date(message.timestamp);
        console.log('Received message:', message);
        this.messageSubject.next(message);
      });

    // Start connection but don't wait for it here
    this.ensureConnection();
  }

  stopConnection() {
    this.hubConnection?.stop();
    this.connectionStatusSubject.next(false);
  }
}