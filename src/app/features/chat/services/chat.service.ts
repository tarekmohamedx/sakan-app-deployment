import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'https://localhost:44392/api/chat';

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
}
