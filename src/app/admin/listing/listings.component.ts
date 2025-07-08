import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminListingService } from '../services/admin-listing.service';

@Component({
  selector: 'app-host-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})

export class AdminApproveListingsComponent implements OnInit {
  listings: any[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 5;
  searchTerm: string = '';
  loadingListingIds: number[] = [];
  constructor(
    private listingService: AdminListingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadListings();
  }

  viewListing(id: number): void {
    this.router.navigate(['/listing', id]);
  }

  loadListings(): void {
    this.listingService.getPendingListings(this.page, this.pageSize, this.searchTerm).subscribe(response => {
      this.listings = response.items;
      this.totalCount = response.totalCount;
      console.log(this.listings);
      
    });
  }

  nextPage() {
    if (this.page * this.pageSize < this.totalCount) {
      this.page++;
      this.loadListings();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadListings();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  onSearch(): void {
    this.page = 1; 
    this.loadListings();
  }

  editListing(id: number): void {
    this.router.navigate(['host/editlisting/', id]);
  }

  approveListing(id: number) {
    this.loadingListingIds.push(id);
  
    this.listingService.approveListing(id).subscribe({
      next: () => {
        Swal.fire('Approved', 'Listing approved ✅', 'success');
        this.listings = this.listings.filter(listing => listing.id !== id);
      },
      error: (err) => {
        Swal.fire('Error', 'Approval failed ❌', 'error');
        console.error(err);
        this.removeFromLoading(id);
      },
      complete: () => {
        this.removeFromLoading(id);
      }
    });
  }
  rejectListing(id: number) {
    this.loadingListingIds.push(id);
  
    this.listingService.rejectListing(id).subscribe({
      next: () => {
         Swal.fire('Rejected', 'Listing rejected ⚠️', 'warning');
        this.listings = this.listings.filter(listing => listing.id !== id);
      },
      error: (err) => {
        Swal.fire('Error', 'Rejection failed ❌', 'error');
        console.error(err);
        this.removeFromLoading(id);
      },
      complete: () => {
        this.removeFromLoading(id);
      }
    });
  }

  private removeFromLoading(id: number): void {
    this.loadingListingIds = this.loadingListingIds.filter(lid => lid !== id);
  }
  goToRooms(listingId: number): void {
    this.router.navigate(['/host/listings', listingId, 'rooms']);
  }

}
