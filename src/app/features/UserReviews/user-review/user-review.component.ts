import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingReview } from '../../../core/models/user-reviews';
import { UserReviewsService } from '../UserReviews.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.css']
})
export class UserReviewComponent implements OnInit {
  bookings: BookingReview[] = [];
  reviewForm!: FormGroup;
  showFormForBookingId: number | null = null;
  pendingBookings: BookingReview[] = [];
  reviewedBookings: BookingReview[] = [];


  constructor(
    private fb: FormBuilder,
    private reviewService: UserReviewsService
  ) {}

  // ngOnInit(): void {
  //   const userId = this.reviewService.getCurrentUserId();
  //   if (!userId) return;

  //   this.loadBookings();

  //   this.reviewForm = this.fb.group({
  //     bookingId: [0, Validators.required],
  //     reviewedUserId: ['', Validators.required],
  //     rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
  //     comment: ['', Validators.maxLength(300)]
  //   });
  // }

  
  ngOnInit(): void {
    const userId = this.reviewService.getCurrentUserId();
    if (!userId) return;
    this.loadBookings();
    this.reviewService.getUserBookings().subscribe({
      next: (res) => {
        this.pendingBookings = res.filter(b => !b.hasReview);
        this.reviewedBookings = res.filter(b => b.hasReview);
      },
      error: () => Swal.fire('Error', 'Failed to load bookings ❌', 'error')
    });
    
    this.reviewForm = this.fb.group({
      bookingId: [0, Validators.required],
      reviewedUserId: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.maxLength(300)]
    });
  }
  
  private loadBookings(): void {
    this.reviewService.getUserBookings().subscribe({
      next: (res) => (this.bookings = res),
      error: () => Swal.fire('Error', 'Failed to load bookings ❌', 'error')
    });
  }

  showReviewForm(booking: BookingReview): void {
    this.showFormForBookingId = booking.bookingId;

    if (booking.hasReview) {
      Swal.fire({
        title: 'Update Review',
        text: 'You have already reviewed this booking. You can edit your review.',
        icon: 'info',
        confirmButtonText: 'Continue'
      });
    }

    this.reviewForm.patchValue({
      bookingId: booking.bookingId,
      reviewedUserId: booking.reviewedUserId,
      rating: booking.rating || null,
      comment: booking.comment || ''
    });
  }

  private refreshBookings(): void {
  this.reviewService.getUserBookings().subscribe({
    next: (res) => {
      this.pendingBookings = res.filter(b => !b.hasReview);
      this.reviewedBookings = res.filter(b => b.hasReview);
    },
    error: () => Swal.fire('Error', 'Failed to refresh bookings ❌', 'error')
  });
}


  submitReview(): void {
    if (this.reviewForm.invalid) {
      Swal.fire('Validation Error', 'Please fill all required fields correctly.', 'warning');
      return;
    }

    const reviewData = this.reviewForm.value;

    this.reviewService.submitReview(reviewData).subscribe({
      next: () => {
        Swal.fire('Success', 'Review submitted successfully ✅', 'success');
        this.reviewForm.reset();
        this.showFormForBookingId = null;
        this.loadBookings(); // Refresh the bookings list
        this.refreshBookings();
      },
      error: () => Swal.fire('Error', 'Failed to submit review ❌', 'error')
    });
  }

  setRating(star: number): void {
    this.reviewForm.get('rating')?.setValue(star);
    this.reviewForm.get('rating')?.markAsDirty();
    this.reviewForm.get('rating')?.updateValueAndValidity();
  }

  isPast(booking: BookingReview): boolean {
    return new Date(booking.toDate) < new Date();
  }
}
