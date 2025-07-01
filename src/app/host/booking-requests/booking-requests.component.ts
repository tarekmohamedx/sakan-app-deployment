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
}
