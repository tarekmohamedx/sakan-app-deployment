import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ActivityLogDto, DashboardSummaryDto } from '../../core/models/admin-dashboard';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  summary?: DashboardSummaryDto;
  signupLogs: ActivityLogDto[] = [];
  listingLogs: ActivityLogDto[] = [];
  isLoading = false;

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

  // Charts
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true };
  barChartType: 'bar' = 'bar';
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Active', 'Approved', 'Pending', 'Rejected'],
    datasets: [{
      label: 'Listings',
      data: [0, 0, 0, 0],
      backgroundColor: ['#0a7298', '#28a745', '#ffc107', '#dc3545']
    }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = { responsive: true };
  pieChartType: 'pie' = 'pie';
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Hosts', 'Guests'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#0a7298', '#f97316']
    }]
  };

  @ViewChild('refreshButton') refreshButton!: ElementRef;
  @ViewChild('barChart') barChart?: BaseChartDirective;
  @ViewChild('pieChart') pieChart?: BaseChartDirective;

  constructor(
    private dashboardService: AdminDashboardService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.renderer.setStyle(document.documentElement, 'scroll-behavior', 'smooth');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateChartData();
    });
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

  this.barChartData.datasets[0].data = [
    this.summary.activeListings,
    this.summary.approvedListings,
    this.summary.pendingListings,
    this.summary.rejectedListings
  ];

  this.pieChartData.datasets[0].data = [
    this.summary.totalHosts,
    this.summary.totalGuests
  ];
  // Force chart updates
  setTimeout(() => {
    this.updateChartData();
    window.dispatchEvent(new Event('resize'));
  }, 0);
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

  handleRefresh(): void {
    const btn = this.refreshButton.nativeElement;
    this.renderer.addClass(btn, 'loading');
    this.loadDashboard();

    setTimeout(() => {
      this.renderer.removeClass(btn, 'loading');
      this.renderer.setStyle(btn, 'background', '#c3e6cb');
      this.renderer.setStyle(btn, 'borderColor', '#28a745');
      setTimeout(() => {
        this.renderer.removeStyle(btn, 'background');
        this.renderer.removeStyle(btn, 'borderColor');
      }, 1000);
    }, 2000);
  }
}
