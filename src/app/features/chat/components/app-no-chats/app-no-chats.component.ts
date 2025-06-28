import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-chats',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="no-chats-container">
      <div class="no-chats-card">
        <div class="icon-wrapper">
          <mat-icon class="chat-icon">chat_bubble_outline</mat-icon>
        </div>
        
        <div class="content">
          <h2 class="primary-message">You don't have any conversations yet</h2>
          <p class="secondary-message">Start by discovering listings or sending a new request.</p>
        </div>
        
        <div class="actions">
          <button 
            mat-raised-button 
            class="primary-button"
            (click)="onDiscoverListings()"
          >
            <mat-icon>explore</mat-icon>
            Discover Listings
          </button>
          
          <button 
            mat-stroked-button 
            class="secondary-button"
            (click)="onSendRequest()"
          >
            <mat-icon>send</mat-icon>
            Send Request
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .no-chats-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #f6fafd 0%, #e3eaf6 50%, #f9f9fb 100%);
    }

    .no-chats-card {
      max-width: 420px;
      width: 100%;
      background: linear-gradient(145deg, #ffffff 0%, #f9f9fb 100%);
      border-radius: 18px;
      padding: 48px 32px;
      text-align: center;
      box-shadow: 
        0 4px 20px rgba(9, 28, 70, 0.08),
        0 1px 3px rgba(9, 28, 70, 0.06);
      border: 1px solid rgba(230, 236, 245, 0.6);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .no-chats-card:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 32px rgba(9, 28, 70, 0.12),
        0 2px 6px rgba(9, 28, 70, 0.08);
    }

    .icon-wrapper {
      margin-bottom: 24px;
    }

    .chat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #7b8794;
      opacity: 0.8;
      transition: all 0.3s ease;
    }

    .content {
      margin-bottom: 32px;
    }

    .primary-message {
      font-size: 24px;
      font-weight: 600;
      color: #091c46;
      margin: 0 0 12px 0;
      line-height: 1.3;
      letter-spacing: -0.02em;
    }

    .secondary-message {
      font-size: 16px;
      color: #7b8794;
      margin: 0;
      line-height: 1.5;
      font-weight: 400;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    .primary-button {
      background: linear-gradient(135deg, #31456e 0%, #5a7ba8 50%, #a2c7f3 100%) !important;
      color: white !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 12px 28px !important;
      font-size: 15px !important;
      font-weight: 500 !important;
      text-transform: none !important;
      letter-spacing: 0.02em !important;
      min-width: 200px;
      height: 44px;
      box-shadow: 
        0 2px 8px rgba(49, 69, 110, 0.3),
        0 1px 3px rgba(49, 69, 110, 0.2) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .primary-button:hover {
      background: linear-gradient(135deg, #2a3d61 0%, #4a6b96 50%, #92b8e8 100%) !important;
      transform: translateY(-1px);
      box-shadow: 
        0 4px 16px rgba(49, 69, 110, 0.4),
        0 2px 6px rgba(49, 69, 110, 0.25) !important;
    }

    .primary-button mat-icon {
      margin-right: 8px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .secondary-button {
      border: 2px solid #e6ecf5 !important;
      color: #2d3748 !important;
      background: transparent !important;
      border-radius: 12px !important;
      padding: 10px 28px !important;
      font-size: 15px !important;
      font-weight: 500 !important;
      text-transform: none !important;
      letter-spacing: 0.02em !important;
      min-width: 200px;
      height: 44px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .secondary-button:hover {
      border-color: #31456e !important;
      color: #31456e !important;
      background: rgba(49, 69, 110, 0.04) !important;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(49, 69, 110, 0.15) !important;
    }

    .secondary-button mat-icon {
      margin-right: 8px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Responsive design */
    @media (max-width: 480px) {
      .no-chats-card {
        padding: 36px 24px;
        margin: 16px;
      }
      
      .primary-message {
        font-size: 22px;
      }
      
      .secondary-message {
        font-size: 15px;
      }
      
      .primary-button,
      .secondary-button {
        min-width: 180px;
        font-size: 14px !important;
      }
    }

    /* Animation for icon */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .no-chats-card {
      animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chat-icon {
      animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
    }

    .primary-message {
      animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
    }

    .secondary-message {
      animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
    }

    .actions {
      animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
    }
  `]
})
export class NoChatsComponent {
  onDiscoverListings(): void {
    // Handle discover listings action
    console.log('Discover Listings clicked');
    // Add your navigation/action logic here
  }

  onSendRequest(): void {
    // Handle send request action
    console.log('Send Request clicked');
    // Add your navigation/action logic here
  }
}