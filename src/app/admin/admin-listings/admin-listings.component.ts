import { Component, OnInit } from '@angular/core';
import { adminListingService } from '../services/admin-listing.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-listings.component.html',
  styleUrl: './admin-listings.component.css'
})
export class AdminListingsComponent implements OnInit {
  listings: any[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;

  constructor(private listingService: adminListingService, private router: Router) {}

  ngOnInit(): void {
    this.fetchListings();
  }

  fetchListings(): void {
    this.loading = true;
    this.listingService.getAllListings(this.page, this.pageSize, this.searchTerm).subscribe({
      next: res => {
        this.listings = res.listings;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

//   approve(id: number): void {
//   console.log('Approving listing ID:', id);
//   this.listingService.ApproveListing(id).subscribe(() => {
//     console.log('Approved successfully');
//     this.fetchListings();
//   });
// }


//   reject(id: number): void {
//     console.log('Rejecting listing ID:', id);
//     this.listingService.RejectListing(id).subscribe(() => {
//       console.log('Rejecting successfully');
//       this.fetchListings()
//     });
//   }

  show(id: number): void {
    console.log('Show listing:', id);
    this.router.navigate(['listing/', id]);
  }

  update(id: number): void {
    console.log('Update listing:', id);
    this.router.navigate(['admin/editlisting/', id]);
  }


  delete(id: number): void {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.listingService.deleteListing(id).subscribe(() => this.fetchListings());
    }
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= Math.ceil(this.totalCount / this.pageSize)) {
      this.page = newPage;
      this.fetchListings();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  onSearch(): void {
    this.page = 1;
    this.fetchListings();
  }
}
