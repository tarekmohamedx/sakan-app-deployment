import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { UserChatSummary } from '../../../core/models/messageDto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'https://localhost:7188/api/chat';

  constructor(private http: HttpClient) {}

  // Get user chats (لـ sidebar)
  getUserChats(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}/chats`);
  }

  // Get messages of a chat
  getChatHistory(chatId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/history/${chatId}`);
  }

  // Send a message
  sendMessage(message: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/send`, message);
  }

  // Create a chat
  createChat(listingId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, { listingId });
  }

  createChatIfNotExists(senderId: string, receiverId: string, listingId: number): Promise<UserChatSummary> {
    const body = { senderId, receiverId, listingId };
    return firstValueFrom(this.http.post<UserChatSummary>(`${this.baseUrl}/CreateChatIfNotExists`, body));
  }

  approveBooking(chatId: number, isHost: boolean): Promise<any> {
    const body = { chatId, isHost };
    return firstValueFrom(this.http.post(`${this.baseUrl}/approve`, body));
  }

  
}
