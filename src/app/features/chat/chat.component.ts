import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './services/chat.service';
import { MessageDto } from '../../core/models/messageDto';
import { ChatHubService } from './services/chat-hub.service';
import { ChatDto } from '../../core/models/chatDto';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(
    private chatService: ChatService,
    private chatHubService: ChatHubService
  ) {}

  chats: ChatDto[] = [];

  selectedChat: any = null;
  messages: MessageDto[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  currentUserId: string = 'user1';

  message: MessageDto = {
    senderID: '',
    receiverID: '',
    content: '',
    chatId: 0
  };

  async ngOnInit() {
    const userId = prompt("Enter your user ID to load your chats:");
    if (!userId) {
      alert("User ID is required!");
      return;
    }

    this.currentUserId = userId;
    this.getChatsByUserId(userId);
    
    // Start SignalR connection
    this.chatHubService.startConnection(userId);

    // Subscribe to connection status
    this.chatHubService.connectionStatus$.subscribe(connected => {
      this.isConnected = connected;
      console.log('Connection status:', connected);
    });

    // Listen for incoming messages
    this.chatHubService.message$.subscribe((message: MessageDto) => {
      if (message.chatId === this.selectedChat?.chatId) {
        this.messages.push(message);
      }
    });
  }

  ngOnDestroy() {
    // Stop SignalR connection
    this.chatHubService.stopConnection();
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChat) return;

    const messageDto: MessageDto = {
      senderID: this.currentUserId,
      receiverID: this.selectedChat.receiverID,
      content: this.newMessage,
      chatId: this.selectedChat.chatId,
      timestamp: new Date()
    };

    try {
      // Try to send via SignalR
      await this.chatHubService.sendMessage(messageDto);
      
      // Add to local messages immediately (optimistic UI)
      this.messages.push(messageDto);
      this.newMessage = '';
    } catch (signalrError) {
      console.warn('SignalR failed, using HTTP fallback');
      
      // Fallback to HTTP API
      this.chatService.sendMessage(messageDto).subscribe({
        next: (serverMessage) => {
          // Replace optimistic message with server version
          const index = this.messages.findIndex(m => 
            m.timestamp === messageDto.timestamp && 
            m.content === messageDto.content
          );
          
          if (index !== -1) {
            this.messages[index] = serverMessage;
          } else {
            this.messages.push(serverMessage);
          }
        },
        error: (httpError) => {
          console.error('HTTP send failed:', httpError);
          // Optionally remove optimistic message on error
          this.messages = this.messages.filter(m => 
            m.timestamp !== messageDto.timestamp || 
            m.content !== messageDto.content
          );
        }
      });
    }
  }

  async selectChat(chat: any) {
    if (!chat?.chatId) {
      console.error('Invalid chat object: missing chatId');
      return;
    }
  
    let receiverID = '';
  
    if (chat.lastMessage) {
      receiverID =
        chat.lastMessage.senderID === this.currentUserId
          ? chat.lastMessage.receiverID
          : chat.lastMessage.senderID;
    } else {
      receiverID = prompt('Enter receiver ID for this chat:') || '';
    }
  
    this.selectedChat = {
      ...chat,
      receiverID
    };
  
    await this.loadChatHistory(chat.chatId);
  }

  private async loadChatHistory(chatId: number) {
    try {
    
      const history = await this.chatService.getChatHistory(chatId).toPromise();
      this.messages = history || [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.messages = [];
    }
  }

  getChatsByUserId(userId: string) {
    this.chatService.getUserChats(userId).subscribe({
      next: (chats) => {
        if (!chats || !Array.isArray(chats)) {
          console.error('Invalid chats response', chats);
          return;
        }
  
        this.chats = chats;
        console.log('Loaded chats:', this.chats);
      },
      error: (err) => {
        console.error('Error fetching user chats:', err);
      }
    });
  }

  getOtherParticipant(chat: ChatDto): string {
    if (!chat.lastMessage) return 'Unknown';
    
    return chat.lastMessage.senderID === this.currentUserId
      ? chat.lastMessage.receiverID
      : chat.lastMessage.senderID;
  }


}