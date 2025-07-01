import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PagedResult } from '../../../../core/models/paged-result.model';
import { ListingSummary } from '../../../../core/models/listing.model';
import { FilterParams } from '../../../../core/models/filter-params.model'; 
import { ListingsService } from '../../services/listings.service';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { ListingCardComponent } from '../../../../shared/components/listing-card/listing-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../../wishlist/services/wishlist.service';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [    CommonModule,FormsModule,RouterModule,
    SearchBarComponent,
    ListingCardComponent,
    PaginationComponent
 ],
  templateUrl: './listings-page.component.html',
  styleUrl: './listings-page.component.css'
})
export class ListingsPageComponent implements OnInit{
// Observable لتخزين نتائج البحث
  listingsResult$!: Observable<PagedResult<ListingSummary>>;
  
  // لتتبع الفلاتر الحالية من الـ URL
  currentParams: FilterParams= { pageSize: 12 };

  // قائمة المفضلة (كمثال، يجب جلبها من خدمة متخصصة)
  favoriteIds = new Set<number>();
  private wishlistSub!: Subscription;

  constructor(
    private listingsService: ListingsService,
    private route: ActivatedRoute, // لقراءة الـ URL
    private router: Router,       // لتحديث الـ URL
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.listingsResult$ = this.route.queryParams.pipe(
      tap(params => this.currentParams = { ...this.currentParams, ...params }), // تخزين البارامترات الحالية
      switchMap(params => 
        this.listingsService.getFilteredListings(params)
      )
    );

    this.wishlistSub = this.wishlistService.favoriteIds$.subscribe(ids => {
      this.favoriteIds = ids;
    });
    
  }
  

  // هذه الدالة يتم استدعاؤها من مكون شريط البحث
  onSearch(filters: any): void {
    const queryParams = { ...filters, pageNumber: 1 };
    this.router.navigate([], { queryParams: queryParams });
  }

  // هذه الدالة يتم استدعاؤها من مكون الترقيم
  onPageChange(pageNumber: number): void {
    const queryParams = { ...this.currentParams, pageNumber: pageNumber };
    this.router.navigate([], { queryParams: queryParams });
  }
  
  // --- دوال التعامل مع بطاقة العرض ---

  isListingInFavorites(listingId: number): boolean {
    return this.favoriteIds.has(listingId);
  }

  handleFavoriteToggle(listingId: number): void {
    this.wishlistService.toggleFavorite(listingId).subscribe({
      next: (response) => console.log(`Listing ${listingId} is now favorite: ${response.isFavorite}`),
      error: (err) => console.error('Error toggling favorite', err) // التعامل مع الأخطاء (مثل 401 Unauthorized)
    });
  }
  onSortChange(sortByValue: string): void {
    const queryParams = { ...this.currentParams, sortBy: sortByValue, pageNumber: 1 };
    this.router.navigate([], { queryParams: queryParams });
  }

  ngOnDestroy(): void {
    // إلغاء الاشتراك لتجنب تسرب الذاكرة
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }
}
