import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { MessageDto } from '../../../core/models/messageDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatHubService {
  private hubConnection!: signalR.HubConnection;
  private connectionPromise: Promise<void> | null = null;
  private isInitialized = false;

  private messageSubject = new Subject<MessageDto>();
  private connectionStatusSubject = new Subject<boolean>();

  message$ = this.messageSubject.asObservable();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  private bookingRequestSubject = new Subject<any>();
public bookingRequest$ = this.bookingRequestSubject.asObservable();

  /**
   * Start SignalR connection if not already connected.
   * Safe to call multiple times.
   */
  public async startConnection(userId: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${environment.serverUrl}/ChatHub?userId=${userId}`)
        .withAutomaticReconnect()
        .build();

      this.setupListeners(); // only once
    }

    await this.ensureConnection();
  }

  /**
   * Setup SignalR listeners
   */
  private setupListeners(): void {
    if (this.isInitialized) return;

    this.hubConnection.on('ReceiveMessage', (message: MessageDto) => {
      message.timestamp = new Date(message.timestamp ?? new Date());
      console.log('[SignalR] Received message:', message);
      this.messageSubject.next(message);
    });

    this.hubConnection.on('ReceiveBookingRequestInfo', (data) => {
      console.log('Received booking info:', data);
      this.bookingRequestSubject.next(data); 
    });
    this.isInitialized = true;
  }

  /**
   * Ensure SignalR connection is active
   */
  private async ensureConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) return;

    if (!this.connectionPromise) {
      this.connectionPromise = this.hubConnection
        .start()
        .then(() => {
          console.log('[SignalR] Connection established');
          this.connectionStatusSubject.next(true);
        })
        .catch((err) => {
          console.error('[SignalR] Connection failed:', err);
          this.connectionStatusSubject.next(false);
          throw err;
        })
        .finally(() => {
          this.connectionPromise = null;
        });
    }

    return this.connectionPromise;
  }

  /**
   * Send message through SignalR
   */
  public async sendMessage(message: MessageDto): Promise<void> {
    try {
      await this.ensureConnection();
      await this.hubConnection.invoke('SendMessage', message);
    } catch (error) {
      console.error('[SignalR] Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Stop SignalR connection
   */
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((err) => console.error('[SignalR] Error stopping connection:', err));
      this.connectionStatusSubject.next(false);
    }
  }

  public async invokeChatWithHost(listingId: number, guestId: string): Promise<void> {
    try {
      await this.ensureConnection();
      await this.hubConnection.invoke('ChatWithHost', listingId, guestId);
    } catch (error) {
      console.error('Error invoking ChatWithHost:', error);
      throw error;
    }
  }
  
}
