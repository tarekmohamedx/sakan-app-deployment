import { Component, OnInit } from '@angular/core';
import { ReviewDto, UserReview } from '../../core/models/HostReview';
import { HostReviewService } from '../services/HostReview.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-host-my-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host-my-reviews.component.html',
  styleUrl: './host-my-reviews.component.css'
})

export class HostMyReviewsComponent implements OnInit {
  reviews: UserReview[] = [];
  editingReviewId: number | null = null;
  rating = 0;
  comment = '';
  currentPage = 1;
  pageSize = 5;

  constructor(
    private reviewService: HostReviewService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

loadReviews(): void {
  this.reviewService.getmyReviews().subscribe({
    next: res => {
      console.log('Fetched reviews:', res); // <-- add this
      this.reviews = res;
      console.log('Total reviews:', this.reviews.length); // Confirm actual count
    },
    error: () => Swal.fire('Error', 'Failed to load reviews', 'error')
  });
}


  //----------------------


  selectedReview: UserReview | null = null;
reviewForm = { rating: 0, comment: '' };

openReviewModal(review: UserReview): void {
  this.selectedReview = review;
  this.reviewForm.rating = review.rating ?? 0;
  this.reviewForm.comment = review.comment ?? '';
}

closeModal(): void {
  this.selectedReview = null;
  this.reviewForm = { rating: 0, comment: '' };
}

submitReview(): void {
  if (!this.selectedReview) return;

  const reviewDto = {
    bookingId: this.selectedReview.bookingId,
    rating: this.reviewForm.rating,
    comment: this.reviewForm.comment,
    reviewedUserId: this.selectedReview.guestId
  };

  this.reviewService.createReview(reviewDto).subscribe({
    next: () => {
      Swal.fire('Success', 'Review submitted', 'success');
      this.closeModal();
      this.loadReviews();
    },
    error: () => Swal.fire('Error', 'Failed to submit review', 'error')
  });
}



get totalPages(): number {
  return Math.ceil(this.reviews.length / this.pageSize);
}

get paginatedReviews(): UserReview[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.reviews.slice(start, start + this.pageSize);
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
