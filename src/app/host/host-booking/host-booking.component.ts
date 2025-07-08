import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HostListingService } from '../services/HostListing.service';
import { HostBooking } from '../../core/models/HostBooking';

@Component({
  selector: 'app-host-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host-booking.component.html',
  styleUrls: ['./host-booking.component.css']
})
export class HostBookingComponent implements OnInit {
  bookings: HostBooking[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 5;
 
  constructor(
    private bookingService: HostListingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getHostBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Error', 'Failed to load bookings.', 'error');
        this.isLoading = false;
      }
    });
  }


  get totalPages(): number {
    return Math.ceil(this.bookings.length / this.pageSize);
  }
  
  get paginatedReviews(): HostBooking[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.bookings.slice(start, start + this.pageSize);
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
