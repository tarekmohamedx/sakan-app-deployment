import { BaseChartDirective } from 'ng2-charts';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivityLogDto, DashboardSummaryDto } from '../../core/models/admin-dashboard';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { CommonModule } from '@angular/common';
import { ChartType, ChartConfiguration } from 'chart.js';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  summary?: DashboardSummaryDto;
  signupLogs: ActivityLogDto[] = [];
  listingLogs: ActivityLogDto[] = [];
  // Pagination – Signups
  signupCurrentPage = 1;
  signupItemsPerPage = 5;
  get signupTotalPages(): number {
    return Math.ceil(this.signupLogs.length / this.signupItemsPerPage);
  }
  get paginatedSignupLogs(): ActivityLogDto[] {
    const start = (this.signupCurrentPage - 1) * this.signupItemsPerPage;
    return this.signupLogs.slice(start, start + this.signupItemsPerPage);
  }

  // Pagination – Listings
  listingCurrentPage = 1;
  listingItemsPerPage = 5;
  get listingTotalPages(): number {
    return Math.ceil(this.listingLogs.length / this.listingItemsPerPage);
  }
  get paginatedListingLogs(): ActivityLogDto[] {
    const start = (this.listingCurrentPage - 1) * this.listingItemsPerPage;
    return this.listingLogs.slice(start, start + this.listingItemsPerPage);
  }


  // // Bar Chart: Listings status
  // barChartOptions: ChartConfiguration<'bar'>['options'] = {
  //   responsive: true,
  // };
  // barChartType: 'bar' = 'bar';
  // barChartData: ChartConfiguration<'bar'>['data'] = {
  //   labels: ['Active', 'Approved', 'Pending', 'Rejected'],
  //   datasets: [
  //     {
  //       label: 'Listings',
  //       data: [0, 0, 0, 0],
  //       backgroundColor: ['#0a7298', '#28a745', '#ffc107', '#dc3545']
  //     }
  //   ]
  // };

  // // Pie Chart: User types
  // pieChartOptions: ChartConfiguration<'pie'>['options'] = {
  //   responsive: true,
  // };
  // // pieChartType: ChartType = 'pie';
  // pieChartType : 'pie' = 'pie';
  // pieChartData: ChartConfiguration<'pie'>['data'] = {
  //   labels: ['Hosts', 'Guests'],
  //   datasets: [
  //     {
  //       data: [0, 0],
  //       backgroundColor: ['#0a7298', '#f97316']
  //     }
  //   ]
  // };


  @ViewChild('refreshButton', { static: false }) refreshButton!: ElementRef;

  constructor(private dashboardService: AdminDashboardService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.renderer.setStyle(document.documentElement, 'scroll-behavior', 'smooth');
  }

   loadDashboard(): void {
    this.dashboardService.getSummary().subscribe((res) => {
      this.summary = res;
      // this.updateChartData();
    });

    this.dashboardService.getRecentActivity().subscribe((logs) => {
      this.signupLogs = logs.filter((log) =>
        log.activityType.toLowerCase().includes('signup')
      );
      this.listingLogs = logs.filter((log) =>
        log.activityType.toLowerCase().includes('listing')
      );

      this.signupCurrentPage = 1;
      this.listingCurrentPage = 1;
    });
  }

    // updateChartData(): void {
    // if (!this.summary) return;

    // this.barChartData.datasets[0].data = [
    //   this.summary.activeListings,
    //   this.summary.approvedListings,
    //   this.summary.pendingListings,
    //   this.summary.rejectedListings,
    // ];

    // this.pieChartData.datasets[0].data = [
    //   this.summary.totalHosts,
    //   this.summary.totalGuests
    // ];

    // console.log('Bar Chart Data:', this.barChartData.datasets[0].data);
    // console.log('Pie Chart Data:', this.pieChartData.datasets[0].data);
  // }

  changeSignupPage(page: number): void {
    if (page >= 1 && page <= this.signupTotalPages) {
      this.signupCurrentPage = page;
    }
  }

  getSignupPageNumbers(): number[] {
    return Array.from({ length: this.signupTotalPages }, (_, i) => i + 1);
  }

  changeListingPage(page: number): void {
    if (page >= 1 && page <= this.listingTotalPages) {
      this.listingCurrentPage = page;
    }
  }

  getListingPageNumbers(): number[] {
    return Array.from({ length: this.listingTotalPages }, (_, i) => i + 1);
  }

    handleRefresh(): void {
    const btn = this.refreshButton.nativeElement;

    this.renderer.addClass(btn, 'loading');

    // Simulate refresh animation
    setTimeout(() => {
      this.renderer.removeClass(btn, 'loading');

      this.renderer.setStyle(btn, 'background', 'rgba(34, 197, 94, 0.2)');
      this.renderer.setStyle(btn, 'borderColor', 'rgba(34, 197, 94, 0.4)');

      setTimeout(() => {
        this.renderer.setStyle(btn, 'background', 'rgba(255, 255, 255, 0.15)');
        this.renderer.setStyle(btn, 'borderColor', 'rgba(255, 255, 255, 0.3)');
      }, 1000);
    }, 2000);
  }

}