import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './services/chat.service';
import { MessageDto } from '../../core/models/messageDto';
import { ChatHubService } from './services/chat-hub.service';
import { ChatDto } from '../../core/models/chatDto';
import { AuthService } from '../auth/services/auth.service'; 
import { MatDialog } from '@angular/material/dialog';
import { ChatConfirmationModalComponent } from './components/chat-confirmation-modal/chat-confirmation-modal.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NoChatsComponent } from './components/app-no-chats/app-no-chats.component';
import { Router } from '@angular/router';
import { ApproveConfirmationModalComponent } from './components/approve-confirmation-modal/approve-confirmation-modal';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private chatHubService: ChatHubService,
    private authService: AuthService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router : Router,
    private toastr : ToastrService
  ) {}

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }


  scrollToBottom(): void {
    setTimeout(() => {
      try {
        const container = this.chatMessagesContainer?.nativeElement;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      } catch (err) {
        console.error('Scroll failed', err);
      }
    }, 100);
  }
  
  chats: ChatDto[] = [];
  selectedChat: any = null;
  messages: MessageDto[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  currentUserId: any;
  listingTitle: string = 'Default Listing Title';
  HostID: string = 'host-123';
  ListingID: string = '4';
  approvalStatus: string = '';
  hostApproved: boolean = false;
  guestApproved: boolean = false; 

  message: MessageDto = {
    senderID: '',
    receiverID: '',
    content: '',
    chatId: 0,
  };

  async ngOnInit() {
alert('Toast should have appeared!');
    this.toastr.success('Toastr is working!', 'Test');
    this.currentUserId = this.authService
      .getUserIdFromToken()
      ?.toString()
      .trim();
    this.chatHubService.startConnection(this.currentUserId);

    this.chatHubService.connectionStatus$.subscribe((connected) => {
      this.isConnected = connected;
    });

    this.chatHubService.message$.subscribe((message: MessageDto) => {
      if (message.chatId === this.selectedChat?.chatId) {
        const exists = this.messages.some(
          (m) =>
            m.timestamp === message.timestamp &&
            m.content === message.content &&
            m.senderID === message.senderID
        );
        if (!exists) {
          this.messages.push(message);
          this.scrollToBottom();
        }
      }
    });

    this.chatHubService.bookingRequest$.subscribe((data) => {
      console.log("Booking info received in component:", data);
    
      this.selectedChat = {
        ...this.selectedChat,
        listingId: data.request.listingId,
        listingTitle: data.request.listingTitle,
        hostId: data.request.hostId,
        hostName: data.request.hostName,
        guestId: data.request.guestId,
        guestName: data.request.guestName
      };
    });

    // Get chats
    this.chatService.getUserChats(this.currentUserId).subscribe({
      next: async (chats) => {
        this.chats = chats;
        if (
          chats.length === 0 &&
          !this.route.snapshot.queryParams['hostId'] &&
          !this.route.snapshot.queryParams['listingId']
        ) {
          console.warn('No chats found for user:', this.currentUserId);
          this.DisplayNoChatsDialog();
        }

        this.route.queryParams.subscribe(async (params) => {
          const hostId = params['hostId'];
          const listingId = params['listingId'];

          console.log('Query params:', params);
          
        
          this.currentUserId = this.authService.getUserIdFromToken()?.toString().trim();
        
          if (hostId && listingId) {
            try {
              const chat = await this.chatService.createChatIfNotExists(
                this.currentUserId,
                hostId,
                +listingId
              );

        
              if (chat) {

                await this.DisplayConfirmationDialog();
        
                this.selectedChat = {
                  ...chat,
                  receiverID: hostId,
                };
                await this.loadChatHistory(chat.chatId);
                await this.chatHubService.invokeChatWithHost(+listingId, this.currentUserId);
                this.router.navigate([], {
                  relativeTo: this.route,
                  queryParams: {},
                  replaceUrl: true,
                });
              }
            } catch (error) {
              console.error('Error creating chat:', error);
            }
          } else {
            this.getChatsByUserId(this.currentUserId);
          }
        });
        
      },
      error: (err) => {
        console.error('Error fetching chats', err);
      },
    });
    await this.BookingApproveNotify();
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
      chatId: +this.selectedChat.chatId,
      timestamp: new Date(),
    };

    try {
      this.messages.push({
        ...messageDto,
        senderID: this.currentUserId.toString().trim(),
        receiverID: this.selectedChat.receiverID.toString().trim(),
      });

      this.newMessage = '';
      this.scrollToBottom();

      // Send via SignalR
      await this.chatHubService.sendMessage(messageDto);
    } catch (signalrError) {
      console.warn('SignalR failed, using HTTP fallback');

      this.chatService.sendMessage(messageDto).subscribe({
        next: (serverMessage) => {
          const index = this.messages.findIndex(
            (m) =>
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
          this.messages = this.messages.filter(
            (m) =>
              m.timestamp !== messageDto.timestamp ||
              m.content !== messageDto.content
          );
        },
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
      receiverID,
    };
    this.approvalStatus = chat?.status ?? '';
    await this.loadChatHistory(chat.chatId);
  }

  async DisplayNoChatsDialog() {
    const dialogRef = this.dialog.open(NoChatsComponent);
    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) {
      console.log('No chats confirmation cancelled');
      
      this.router.navigate(['/home']);
      return;
    }
  }

  async DisplayApproveDialog() {
    const dialogRef = this.dialog.open(ApproveConfirmationModalComponent);
    const result = await dialogRef.afterClosed().toPromise();
  
    if (result === 'confirm') {
      console.log('User confirmed');

    } else if (result === 'cancel') {
      console.log('User cancelled');
    }
    return result;
    
  }

  async DisplayConfirmationDialog() {
    const dialogRef = this.dialog.open(ChatConfirmationModalComponent);
    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) {
      console.log('Chat confirmation cancelled');
      return;
    }
  }

  private async loadChatHistory(chatId: number) {
    try {
      const history = await this.chatService.getChatHistory(chatId).toPromise();

      this.messages = (history || []).map((message: any) => ({
        ...message,
        senderID:
          message.senderID?.toString().trim() ||
          message.senderId?.toString().trim() ||
          '',
        receiverID:
          message.receiverID?.toString().trim() ||
          message.receiverId?.toString().trim() ||
          '',
        timestamp: new Date(message.timestamp),
      }));

      console.log(this.messages, 'Chat history loaded:', this.messages);

      this.scrollToBottom();
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
      },
    });
  }

  getOtherParticipant(chat: ChatDto): string {
    if (!chat.lastMessage) return 'Unknown';

    return chat.lastMessage.senderID === this.currentUserId
      ? chat.lastMessage.receiverID
      : chat.lastMessage.senderID;
  }

  getLatestMessage(chat: ChatDto): string {
    if (!chat.lastMessage) return 'Unknown';

    return chat.lastMessage.content || 'No messages yet';
  }

  getListingTitle(chat: ChatDto): string {
    if (!chat.lastMessage) return 'Unknown';

    return chat.listingTitle || 'No messages yet';
  }

  getUserName(chat: ChatDto): string {
    if (!chat.userName) return 'Unknown';

    return chat.userName || 'No messages yet';
  }

  async onApproveClick() {
    console.log("Approve Button Clicked");
  
    const result = await this.DisplayApproveDialog();
    console.log(result, "Dialog result");
  
    if (result === 'confirm') {
      if (!this.selectedChat) return;
  

  
      try {
        // const chatId = this.selectedChat?.id;
        
        const chatId = this.messages[0]?.chatId;
        console.log("Chat Id: " + chatId);
        
        
        if (!chatId) return;
        
        const bookingId = await firstValueFrom(this.chatService.getBookingId(chatId));
        console.log("Booking Id: " + bookingId);
        
    
        let userRole;
        const roles = this.authService.getRoleFromToken();
        if (roles) {
          console.log(roles[0]);
          userRole = roles[0];
        }
         const isHost = userRole === 'Host';
         console.log(`Is user a host? ${isHost}`);
         
        

        
         const approvalResult = await this.chatService.approveBooking(chatId, bookingId, isHost);

         this.approvalStatus = approvalResult?.status;
         console.log("Approval status updated:", this.approvalStatus);
         
        
        // console.log("Approval status updated:", this.approvalStatus);
  
        switch (this.approvalStatus) {
          case "GoToPayment":
            // show "Pay Now" button
            break;
          case "PendingHost":
            // show "Waiting for host approval"
            
            break;
          case "PendingGuest":
            // show "Waiting for guest approval"
            break;
          case "PendingUserBooking":
            // show "Guest needs to book"
            break;
          case "Approved":
            // show "Booking Confirmed"
            break;
          default:
            // handle other states
            break;
        }
  
      } catch (error) {
        console.error("Approval failed", error);
      }
    } else {
      console.log("User cancelled approval.");
    }
  }
  
  async BookingApproveNotify(){
    this.chatHubService.bookingRequest$.subscribe((data) => {
      console.log('[SignalR] Booking status update received:', data);
  
      const message = `${data.userName} ${
        data.status === 'GoToPayment'
          ? 'approved the booking, please proceed to payment.'
          : data.status === 'PendingHost'
          ? 'approved the request. Waiting for host confirmation.'
          : data.status === 'PendingGuest'
          ? 'approved the request. Waiting for guest confirmation.'
          : 'updated booking status.'
      }`;
  
      this.toastr.info(message, data.listingTitle);
    });
  }


  getApprovalMessage(): string {
    switch (this.approvalStatus) {
      case "GoToPayment":
        return 'Booking approved! Proceed to payment.';
      case "PendingHost":
        return 'You approved the request. Waiting for host confirmation.';
      case "PendingGuest":
        return 'You approved the request. Waiting for guest confirmation.';
      case "PendingUserBooking":
        return 'Guest needs to complete the booking.';
      case "Approved":
        return 'Booking confirmed!';
      default:
        return '';
    }
  }
  goToPayment() {
    this.router.navigate(['/payment']);
    //still need to implement the payment logic
  }
  

}