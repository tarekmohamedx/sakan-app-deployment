import { Component, OnInit } from '@angular/core';
import { ReviewDto, UserReview } from '../../core/models/HostReview';
import { HostReviewService } from '../services/HostReview.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-host-user-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host-user-reviews.component.html',
  styleUrl: './host-user-reviews.component.css'
})
export class HostUserReviewsComponent implements OnInit {
  reviews: UserReview[] = [];
  selectedReview: UserReview | null = null;

  reviewForm = {
    rating: 0,
    comment: ''
  };

  constructor(
    private reviewService: HostReviewService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getUserReviews().subscribe({
      next: res => this.reviews = res,
      error: () => this.toastr.error('Failed to load reviews')
    });
  }

  openReviewModal(review: UserReview): void {
    this.selectedReview = review;
    this.reviewForm = {
      rating: 0,
      comment: ''
    };
  }

  closeModal(): void {
    this.selectedReview = null;
    this.reviewForm = {
      rating: 0,
      comment: ''
    };
  }

  submitReview(): void {
    if (!this.selectedReview) return;

    const reviewDto: ReviewDto = {
      bookingId: this.selectedReview.bookingId,
      reviewedUserId: this.selectedReview.guestId,
      rating: this.reviewForm.rating,
      comment: this.reviewForm.comment,
      reviewId: 0,             // Placeholder, backend will ignore
      reviewerId: '',          // Will be set server-side
      createdAt: '',           // Will be set server-side
      isActive: true
    };

    this.reviewService.submitReview(reviewDto).subscribe({
      next: () => {
        this.toastr.success('Review submitted successfully');
        this.closeModal();
        this.loadReviews();
      },
      error: () => this.toastr.error('Failed to submit review')
    });
  }
}
