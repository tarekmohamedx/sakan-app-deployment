export interface UserReview {
  reviewerId: string;
  reviewedUserId?: string;
  listingId?: number;
  bookingId: number;
  rating: number;
  comment: string;
}

export interface ReviewDto {
  reviewerName?: string;
  listingId: number;
  listingTitle?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BookingReview {
  bookingId: number;
  reviewedUserId: string; 
  listingTitle: string;
  listingId?: number;
  fromDate: string;
  toDate: string;
  hasReview: boolean;
   rating?: number; // ✅
  comment?: string; 
}

