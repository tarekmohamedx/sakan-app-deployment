export interface MessageDto {
    senderID?: string; 
    receiverID: string;
    content: string;
    timestamp?: Date;
    chatId?: number;
  }

  export interface MessageModel {
    senderID: string;
    receiverID: string;
    content: string;
    timestamp: Date;
    chatId: number;
  }
  
  export interface UserChatSummary {
    chatId: number;
    listingId: number;
    lastMessage: MessageModel;
  }