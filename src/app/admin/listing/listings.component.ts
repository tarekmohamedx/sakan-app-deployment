import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminListingService } from '../services/admin-listing.service';

@Component({
  selector: 'app-host-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})

export class AdminListingsComponent implements OnInit {
  listings: any[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 5;
  searchTerm: string = '';

  constructor(
    private listingService: AdminListingService,
    private router: Router,
    private toastr: ToastrService
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

  // deleteListing(id: number): void {
  //   if (confirm('Are you sure you want to delete this listing?')) {
  //     this.listingService.deleteListing(id).subscribe({
  //       next: () => {
  //         this.loadListings();
  //         this.toastr.success('Listing deleted successfully');
  //       },
  //       error: (err) => this.toastr.error('Delete failed: ' + err.message)
  //     });
  //   }
  // }

  approveListing(id: number) {
    this.listingService.approveListing(id).subscribe(() => {
      this.toastr.success('Listing approved');
      this.loadListings();
    });
  }
  
  rejectListing(id: number) {
    this.listingService.rejectListing(id).subscribe(() => {
      this.toastr.warning('Listing rejected');
      this.loadListings();
    });
  }
  
  

  goToRooms(listingId: number): void {
    this.router.navigate(['/host/listings', listingId, 'rooms']);
  }

}
