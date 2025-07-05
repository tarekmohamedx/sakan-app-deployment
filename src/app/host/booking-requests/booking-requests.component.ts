import { Component, OnInit } from '@angular/core';
import { BookingRequestsService, BookingRequest } from '../services/BookingRequests.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-requests.component.html',
  styleUrl: './booking-requests.component.css'
})
export class BookingRequestsComponent implements OnInit {
  requests: BookingRequest[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private bookingRequestsService: BookingRequestsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.bookingRequestsService.getBookingRequests().subscribe({
      next: res => { this.requests = res; this.loading = false; },
      error: () => { this.toastr.error('Failed to load requests'); this.loading = false; }
    });
  }

  updateRequest(requestId: number, isAccepted: boolean): void {
    this.bookingRequestsService.updateBookingRequest(requestId, isAccepted).subscribe({
      next: () => {
        this.toastr.success(isAccepted ? 'Request approved' : 'Request rejected');
        this.loadRequests();
      },
      error: () => this.toastr.error('Failed to update request')
    });
  }

    get totalPages(): number {
      return Math.ceil(this.requests.length / this.pageSize);
    }
    
    get paginatedReviews(): BookingRequest[] {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.requests.slice(start, start + this.pageSize);
    }
    
    changePage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
    
    getPageNumbers(): number[] {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

}
