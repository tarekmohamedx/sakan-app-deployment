export interface ChatDto {
    chatId: number;
    listingId: number;
    name?: string;
    lastMessage?: {
      content: string;
      timestamp: string;
      senderID: string;
      receiverID: string;
    };
  }