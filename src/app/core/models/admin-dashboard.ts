export interface DashboardSummaryDto {
  totalHosts: number;
  totalGuests: number;
  totalListings: number;
  activeListings: number;
  approvedListings: number;
  pendingListings: number;
  rejectedListings: number;
  pendingApprovals: number;
  openComplaints: number;
  resolvedComplaints: number;
  unreadMessages: number;
}

export interface ActivityLogDto {
  activityType: string;
  description: string;
  timestamp: string;
}