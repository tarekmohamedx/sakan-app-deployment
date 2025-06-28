import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-chat-confirmation-modal',
  standalone: true,
  imports: [MatDialogModule],
  // templateUrl: './chat-confirmation-modal.component.html',
  template: `
  <div class="dialog-container">
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">
        <span class="dialog-icon">💬</span>
        Start Conversation?
      </h2>
    </div>
    
    <mat-dialog-content class="dialog-content">
      <p class="dialog-message">
        Would you like to begin a conversation with this person? 
        You'll be able to send messages and receive replies instantly.
      </p>
    </mat-dialog-content>
    
    <mat-dialog-actions class="dialog-actions" align="end">
      <button 
        mat-stroked-button 
        class="cancel-btn"
        (click)="close(false)">
        <span class="btn-icon">✕</span>
        Cancel
      </button>
      <button 
        mat-raised-button 
        class="start-btn"
        color="primary" 
        (click)="close(true)">
        <span class="btn-icon">➤</span>
        Start Chat
      </button>
    </mat-dialog-actions>
  </div>
  
  <style>
    .dialog-container {
      padding: 0;
      max-width: 420px;
      border-radius: 18px;
      overflow: hidden;
      background: linear-gradient(120deg, #f6fafd 60%, #e3eaf6 100%);
    }
    
    .dialog-header {
      background: linear-gradient(120deg, #f9f9fb 80%, #e6ecf5 100%);
      padding: 1.5rem 2rem 1rem;
      border-bottom: 1.5px solid #e3eaf6;
    }
    
    .dialog-title {
      margin: 0 !important;
      color: #091c46 !important;
      font-size: 1.4rem !important;
      font-weight: 700 !important;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      letter-spacing: 0.01em;
    }
    
    .dialog-icon {
      color: #31456e !important;
      font-size: 1.3rem !important;
      margin-right: 0.25rem !important;
    }
    
    .btn-icon {
      font-size: 0.9rem !important;
      margin-right: 0.25rem !important;
      cursor: pointer ;
    }
    
    .dialog-content {
      padding: 1.5rem 2rem !important;
      background: #f6fafd;
    }
    
    .dialog-message {
      margin: 0 !important;
      color: #2d3748 !important;
      font-size: 1.05rem !important;
      line-height: 1.6 !important;
      text-align: center;
    }
    
    .dialog-actions {
      padding: 1rem 2rem 1.5rem !important;
      gap: 1rem !important;
      background: linear-gradient(120deg, #f9f9fb 80%, #e6ecf5 100%);
      border-top: 1.5px solid #e3eaf6;
    }
    
    .cancel-btn {
      color: #7b8794 !important;
      border-color: #e3eaf6 !important;
      border-radius: 12px !important;
      padding: 0.6rem 1.2rem !important;
      font-weight: 500 !important;
      transition: all 0.18s ease !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      cursor: pointer;
    }
    
    .cancel-btn:hover {
      background: #e3eaf6 !important;
      color: #091c46 !important;
      box-shadow: 0 2px 8px rgba(80, 120, 180, 0.07) !important;
    }
    
    .start-btn {
      background: linear-gradient(90deg, #31456e 60%, #a2c7f3 100%) !important;
      color: white !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 0.6rem 1.5rem !important;
      font-weight: 600 !important;
      font-size: 1rem !important;
      box-shadow: 0 2px 8px rgba(59,130,246,0.09) !important;
      transition: all 0.18s ease !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      cursor: pointer;
    }
    
    .start-btn:hover {
      background: linear-gradient(90deg, #072e9ba9 60%, #58709ed8 100%) !important;
      box-shadow: 0 4px 16px rgba(59,130,246,0.13) !important;
      transform: translateY(-1px) !important;
    }
    

    
    /* Override Material Dialog defaults */
    ::ng-deep .mat-dialog-container {
      padding: 0 !important;
      border-radius: 18px !important;
      box-shadow: 0 8px 32px rgba(60, 120, 200, 0.08) !important;
    }
    
    ::ng-deep .mat-dialog-title {
      margin: 0 !important;
    }
    
    ::ng-deep .mat-dialog-content {
      margin: 0 !important;
    }
    
    ::ng-deep .mat-dialog-actions {
      margin: 0 !important;
      min-height: auto !important;
    }
  </style>
`,
  styleUrl: './chat-confirmation-modal.component.css'
})
export class ChatConfirmationModalComponent {
  constructor(private dialogRef: MatDialogRef<ChatConfirmationModalComponent>){}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
