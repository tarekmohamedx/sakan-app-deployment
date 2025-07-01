import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

export interface BookingRequest {
  id: string;
  guestName: string;
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: 'pending' | 'approved' | 'declined';
  requestDate: Date;
}

export interface DashboardStats {
  requestedCount: number;
  activeListings: number;
  approvedListings: number;
  occupancyRate: number;
  thisMonthRevenue: number;
  averageRating: number;
  recentBookingRequests: BookingRequest[];
}

@Component({
  selector: 'app-host-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    requestedCount: 0,
    activeListings: 0,
    approvedListings: 0,
    occupancyRate: 0,
    thisMonthRevenue: 0,
    averageRating: 0,
    recentBookingRequests: []
  };

  isLoading = true;
  error: string | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;

      // Simulate concurrent API calls
      const [
        requestedCount,
        activeListings,
        approvedListings,
        occupancyRate,
        thisMonthRevenue,
        averageRating,
        recentBookingRequests
      ] = await Promise.all([
        this.GetRequestedCountAsync(),
        this.GetActiveListingCount(),
        this.GetApprovedListingCount(),
        this.GetOccupancyRate(),
        this.GetThisMonthRevenue(),
        this.GetAverageRatingForHost(),
        this.GetTodaysRequestsAsync()
      ]);

      this.stats = {
        requestedCount,
        activeListings,
        approvedListings,
        occupancyRate,
        thisMonthRevenue,
        averageRating,
        recentBookingRequests
      };

    } catch (error) {
      this.error = 'Failed to load dashboard data. Please try again.';
      console.error('Dashboard loading error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Simulated API methods
  private async GetRequestedCountAsync(): Promise<number> {
    await this.delay(800);
    return Math.floor(Math.random() * 50) + 10;
  }

  private async GetActiveListingCount(): Promise<number> {
    await this.delay(600);
    return Math.floor(Math.random() * 15) + 5;
  }

  private async GetApprovedListingCount(): Promise<number> {
    await this.delay(700);
    return Math.floor(Math.random() * 12) + 3;
  }

  private async GetOccupancyRate(): Promise<number> {
    await this.delay(500);
    return Math.round((Math.random() * 40 + 60) * 100) / 100; // 60-100%
  }

  private async GetThisMonthRevenue(): Promise<number> {
    await this.delay(900);
    return Math.round((Math.random() * 5000 + 2000) * 100) / 100;
  }

  private async GetAverageRatingForHost(): Promise<number> {
    await this.delay(650);
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // 3.5-5.0
  }

  private async GetTodaysRequestsAsync(): Promise<BookingRequest[]> {
    await this.delay(1000);
    
    const sampleRequests: BookingRequest[] = [
      {
        id: '1',
        guestName: 'John Smith',
        propertyName: 'Cozy Downtown Apartment',
        checkIn: new Date(2025, 6, 15),
        checkOut: new Date(2025, 6, 18),
        guests: 2,
        status: 'pending',
        requestDate: new Date()
      },
      {
        id: '2',
        guestName: 'Sarah Johnson',
        propertyName: 'Modern Loft with City View',
        checkIn: new Date(2025, 6, 20),
        checkOut: new Date(2025, 6, 25),
        guests: 4,
        status: 'approved',
        requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '3',
        guestName: 'Mike Chen',
        propertyName: 'Beachfront Villa',
        checkIn: new Date(2025, 6, 10),
        checkOut: new Date(2025, 6, 14),
        guests: 6,
        status: 'pending',
        requestDate: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '4',
        guestName: 'Emily Davis',
        propertyName: 'Cozy Downtown Apartment',
        checkIn: new Date(2025, 7, 1),
        checkOut: new Date(2025, 7, 3),
        guests: 2,
        status: 'declined',
        requestDate: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: '5',
        guestName: 'Robert Wilson',
        propertyName: 'Mountain Cabin Retreat',
        checkIn: new Date(2025, 6, 28),
        checkOut: new Date(2025, 7, 2),
        guests: 8,
        status: 'pending',
        requestDate: new Date(Date.now() - 8 * 60 * 60 * 1000)
      }
    ];

    return sampleRequests.slice(0, 5);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods for template
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'declined': return 'status-declined';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  }

  async refreshData(): Promise<void> {
    await this.loadDashboardData();
  }
}