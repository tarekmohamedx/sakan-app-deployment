import { CommonModule } from '@angular/common';
import { Component, Host, OnInit } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import {  HostService } from '../../core/services/host.service';
import { firstValueFrom } from 'rxjs';
import { HostDashboardDTO } from '../../core/models/host-dashboard.model';

@Component({
  selector: 'app-host-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
      refreshData() {
        console.log('Refresh Data');
      }
  stats: HostDashboardDTO = {
    todaysRequestsCount: 0,
    activeListingsCount: 0,
    approvedListingsCount: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    recentRequests: [],
    totalBookings: 0,
    latestReview: undefined
  };

  isLoading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private hostService: HostService
  ) {}
  
  async ngOnInit() {
    const hostId = await this.authService.getUserIdFromToken();
    if (hostId) {
      this.loadDashboardData(hostId);
    }
  }
  
  async loadDashboardData(hostId: string): Promise<void> {
    try {
      this.isLoading = true;
      const data = await firstValueFrom(this.hostService.getDashboardData(hostId));
      console.log('Dashboard data:', data);
      
      this.stats = {
        todaysRequestsCount: data?.todaysRequestsCount,
        activeListingsCount: data.activeListingsCount,
        approvedListingsCount: data.approvedListingsCount,
        occupancyRate: data.occupancyRate,
        monthlyRevenue: data.monthlyRevenue,
        averageRating: data.averageRating,
        recentRequests: data.recentRequests,
        totalBookings: data.totalBookings,
        latestReview: data.latestReview
      };
    } catch (error) {
      this.error = 'Failed to load dashboard data.';
    } finally {
      this.isLoading = false;
    }
  }
}