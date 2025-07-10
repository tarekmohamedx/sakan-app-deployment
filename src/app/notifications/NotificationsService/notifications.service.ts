import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../../core/models/Notification';
// import { Notification } from '../core/models/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://localhost:7188/api/notifications';

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/${userId}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/mark-read`, {});
  }

  markAllAsRead(userId: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/mark-all-as-read/${userId}`, {});
}

deleteNotification(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}


}
