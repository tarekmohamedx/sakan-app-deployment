export interface UserReview {
  bookingId: number;
  guestId: string;
  guestName: string;
  comment?: string;
  rating?: number;
  createdAt?: string;
}


export interface ReviewDto {
  reviewId: number;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
  bookingId: number;
  isActive: boolean;
  guestName?: string;
}
