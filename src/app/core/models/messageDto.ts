export interface MessageDto {
    senderID?: string; 
    receiverID: string;
    content: string;
    timestamp?: Date;
    chatId?: number;
  }