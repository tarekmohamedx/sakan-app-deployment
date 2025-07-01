import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private bookingService: HostListingService,
    private toastr: ToastrService
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
        this.toastr.error('Failed to load bookings.');
        this.isLoading = false;
      }
    });
  }
}
