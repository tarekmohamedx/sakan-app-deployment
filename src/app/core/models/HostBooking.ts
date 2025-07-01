export interface HostBooking {
  id: number;
  guestName: string;
  guestEmail: string;
  listingTitle: string;
  roomName?: string;
  bedLabel?: string;
  fromDate: string;
  toDate: string;
  price?: number;
  paymentStatus: string;
  createdAt: string;
}
