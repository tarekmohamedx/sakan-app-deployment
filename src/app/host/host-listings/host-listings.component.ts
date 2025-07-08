import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HostListingService } from '../services/HostListing.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-host-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host-listings.component.html',
  styleUrl: './host-listings.component.css'
})

export class HostListingsComponent implements OnInit {
  listings: any[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 5;
  searchTerm: string = '';

  constructor(
    private listingService: HostListingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadListings();
  }

  viewListing(id: number): void {
    this.router.navigate(['/listing', id]);
  }

  loadListings(): void {
    this.listingService.getMyListings(this.page, this.pageSize, this.searchTerm).subscribe(response => {
      this.listings = response.listings;
      this.totalCount = response.totalCount;
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

  deleteListing(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This listing will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listingService.deleteListing(id).subscribe({
          next: () => {
            this.loadListings();
            Swal.fire('Deleted!', 'Listing deleted successfully.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', 'Delete failed: ' + err.message, 'error');
          }
        });
      }
    });
  }

  goToRooms(listingId: number): void {
    this.router.navigate(['/host/listings', listingId, 'rooms']);
  }

}
