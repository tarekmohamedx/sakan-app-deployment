export interface ChatDto {
  chatId: number;
  listingId: number;
  listingTitle?: string; 
  listingStatus?: string;
  hostName?: string;
  userName?: string;

  lastMessage?: {
    content: string;
    timestamp: string;
    senderID: string;
    receiverID: string;
  };
}
