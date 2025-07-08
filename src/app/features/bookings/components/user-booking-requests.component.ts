import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserBookingRequestsService, UserBookingRequest } from '../services/user-booking-requests.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-booking-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-booking-requests.component.html',
  styleUrl: './user-booking-requests.component.css'
})
export class UserBookingRequestsComponent implements OnInit {
  requests: UserBookingRequest[] = [];
  loading = false;
  popupOpen = true;

  @Output() close = new EventEmitter<void>();

  constructor(
    private bookingRequestsService: UserBookingRequestsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.bookingRequestsService.getUserBookingRequests().subscribe({
      next: (res: UserBookingRequest[]) => { this.requests = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  closePopup() {
    this.popupOpen = false;
    this.close.emit();
  }

  goToChat(request: UserBookingRequest) {
    this.closePopup();
    // Navigate to chat with host (assuming hostId is available in request)
    if (request.hostId) {
      this.router.navigate(['/chat'], { queryParams: { hostId: request.hostId, bookingId: request.bookingRequestId } });
    } else {
      this.router.navigate(['/chat']);
    }
  }
}
