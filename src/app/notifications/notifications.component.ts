// notifications.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { NotificationService } from './NotificationsService/notifications.service';
import { AuthService } from '../features/auth/services/auth.service';
import { Notification } from '../core/models/Notification';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  userId: string = '';
  showDropdown = false;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken()!;
    this.fetchNotifications();
  }

  deleteNotification(id: number): void {
  this.notificationService.deleteNotification(id).subscribe(() => {
    this.notifications = this.notifications.filter(n => n.id !== id);
  });
}


  fetchNotifications(): void {
    this.notificationService.getUserNotifications(this.userId).subscribe(data => {
      this.notifications = data;
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.notifications = this.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
    });
  }

  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter(n => !n.isRead);
    
    if (unreadNotifications.length > 0) {
      // Assuming you have a service method to mark all as read
      this.notificationService.markAllAsRead(this.userId).subscribe(() => {
        this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      });
    }
  }

  onNotificationClick(notification: Notification): void {
    this.markAsRead(notification.id);
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
    this.closeDropdown();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const notificationContainer = target.closest('.notification-container');
    
    if (!notificationContainer && this.showDropdown) {
      this.closeDropdown();
    }
  }

  // Close dropdown with ESC key
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.showDropdown) {
      this.closeDropdown();
    }
  }
}



