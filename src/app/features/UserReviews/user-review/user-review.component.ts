import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BookingReview } from '../../../core/models/user-reviews';
import { UserReviewsService } from '../UserReviews.service';

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

  constructor(
    private fb: FormBuilder,
    private reviewService: UserReviewsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const userId = this.reviewService.getCurrentUserId(); // works for guest too
    if (!userId) return;

    this.reviewService.getUserBookings().subscribe({
      next: (res) => (this.bookings = res),
      error: () => this.toastr.error('Failed to load bookings')
    });


    this.reviewForm = this.fb.group({
      bookingId: [0, Validators.required],
      reviewedUserId: ['', Validators.required],
      reviewerId: ['', Validators.required], 
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.maxLength(300)]
    });
  }

showReviewForm(booking: BookingReview): void {
  console.log('Clicked booking:', booking); // Check what you get
  this.showFormForBookingId = booking.bookingId;

  this.reviewForm.patchValue({
    bookingId: booking.bookingId,
    reviewedUserId: booking.reviewedUserId,
    reviewerId: this.reviewService.getCurrentUserId() 
  });
}


submitReview(): void {
  console.log('Submitting review...');
  console.log(this.reviewForm.value);
  console.log('Valid?', this.reviewForm.valid);

  if (this.reviewForm.invalid) {
    console.warn('Form is invalid. Details:');
    Object.entries(this.reviewForm.controls).forEach(([name, control]) => {
      console.warn(`${name}:`, control.errors, 'Value:', control.value);
    });
    this.toastr.warning('Please fill all required fields correctly.');
    return;
  }

  this.reviewService.submitReview(this.reviewForm.value).subscribe({
    next: () => {
      this.toastr.success('Review submitted successfully');
      this.reviewForm.reset();
      this.showFormForBookingId = null;
    },
    error: () => this.toastr.error('Failed to submit review')
  });
}


setRating(star: number): void {
  this.reviewForm.get('rating')?.setValue(star);
  this.reviewForm.get('rating')?.markAsDirty();
  this.reviewForm.get('rating')?.updateValueAndValidity();
}


}
