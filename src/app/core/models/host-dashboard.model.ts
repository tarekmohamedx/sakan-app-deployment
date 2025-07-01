export interface ReviewDetailsDto {
    reviewerName: string;
    listingId: number;
    listingTitle: string;
    rating: number;
    comment: string;
    createdAt: string;
  }
  
  export interface BookingRequestDto {
    guestName: string;
    guestId: string;
    listingTitle: string;
    listingId: number;
    roomName?: string;
    roomId?: number;
    bedId?: number;
    fromDate: string;
    toDate: string;
  }
  
  export interface HostDashboardDTO {
    activeListingsCount: number;
    approvedListingsCount: number;
    totalBookings: number;
    monthlyRevenue: number;
    occupancyRate: number;
    averageRating: number;
    latestReview?: ReviewDetailsDto;
    todaysRequestsCount: number;
    recentRequests: BookingRequestDto[];
  }