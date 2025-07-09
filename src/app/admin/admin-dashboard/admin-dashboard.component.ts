import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { finalize } from 'rxjs/operators';

import { ActivityLogDto, DashboardSummaryDto } from '../../core/models/admin-dashboard';
import { AdminDashboardService } from '../services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  summary?: DashboardSummaryDto;
  signupLogs: ActivityLogDto[] = [];
  listingLogs: ActivityLogDto[] = [];
  isLoading = false;

  // Bar Chart Data
  listingStatusData = [
    { name: 'Active', value: 0 },
    { name: 'Approved', value: 0 },
    { name: 'Pending', value: 0 },
    { name: 'Rejected', value: 0 }
  ];

  // Pie Chart Data
  userTypeData = [
    { name: 'Hosts', value: 0 },
    { name: 'Guests', value: 0 }
  ];

  colorScheme = {
    domain: ['#0a7298', '#28a745', '#ffc107', '#dc3545']
  };

  pieColorScheme = {
    domain: ['#0a7298', '#f97316']
  };

  // Pagination
  signupCurrentPage = 1;
  listingCurrentPage = 1;
  signupItemsPerPage = 5;
  listingItemsPerPage = 5;

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;

    this.dashboardService.getSummary()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.summary = res;
        this.updateChartData();
      });

    this.dashboardService.getRecentActivity().subscribe(logs => {
      this.signupLogs = logs.filter(log => log.activityType.toLowerCase().includes('signup'));
      this.listingLogs = logs.filter(log => log.activityType.toLowerCase().includes('listing'));
      this.signupCurrentPage = 1;
      this.listingCurrentPage = 1;
    });
  }

  updateChartData(): void {
    if (!this.summary) return;

    this.listingStatusData = [
      { name: 'Active', value: this.summary.activeListings },
      { name: 'Approved', value: this.summary.approvedListings },
      { name: 'Pending', value: this.summary.pendingListings },
      { name: 'Rejected', value: this.summary.rejectedListings }
    ];

    this.userTypeData = [
      { name: 'Hosts', value: this.summary.totalHosts },
      { name: 'Guests', value: this.summary.totalGuests }
    ];
  }

  get signupTotalPages(): number {
    return Math.ceil(this.signupLogs.length / this.signupItemsPerPage);
  }

  get listingTotalPages(): number {
    return Math.ceil(this.listingLogs.length / this.listingItemsPerPage);
  }

  get paginatedSignupLogs(): ActivityLogDto[] {
    const start = (this.signupCurrentPage - 1) * this.signupItemsPerPage;
    return this.signupLogs.slice(start, start + this.signupItemsPerPage);
  }

  get paginatedListingLogs(): ActivityLogDto[] {
    const start = (this.listingCurrentPage - 1) * this.listingItemsPerPage;
    return this.listingLogs.slice(start, start + this.listingItemsPerPage);
  }

  changeSignupPage(page: number): void {
    if (page >= 1 && page <= this.signupTotalPages) {
      this.signupCurrentPage = page;
    }
  }

  changeListingPage(page: number): void {
    if (page >= 1 && page <= this.listingTotalPages) {
      this.listingCurrentPage = page;
    }
  }

  getSignupPageNumbers(): number[] {
    return Array.from({ length: this.signupTotalPages }, (_, i) => i + 1);
  }

  getListingPageNumbers(): number[] {
    return Array.from({ length: this.listingTotalPages }, (_, i) => i + 1);
  }
}
