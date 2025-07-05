import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

// استيراد الواجهات والخدمات
import { ListingSummary } from '../../../../core/models/listing.model';
import { ListingsService } from '../../../listings/services/listings.service';

// استيراد المكونات المشتركة
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { ListingCardComponent } from '../../../../shared/components/listing-card/listing-card.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../../wishlist/services/wishlist.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [    CommonModule,
    SearchBarComponent,
    ListingCardComponent,
    FormsModule,
    RouterModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
// Observables لجلب البيانات لكل قسم
    highestRatedListings$!: Observable<ListingSummary[]>;
  newestListings$!: Observable<ListingSummary[]>; // <-- جديد
  mostAffordableListings$!: Observable<ListingSummary[]>; // <-- جديد
  
  // بيانات ثابتة لقسم "Featured Destinations"
  featuredDestinations = [
    { name: 'Cairo', image: 'https://media.cntraveler.com/photos/655cdf1d2d09a7e0b27741b5/16:9/w_2560%2Cc_limit/Cairo%2520Egypt_GettyImages-1370918272.jpg'},
    { name: 'Giza', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/1280px-All_Gizah_Pyramids.jpg' },
    { name: 'Alexandria', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSc8pbROiMPcATSeVWBzH9BEn2xs95RNucagJw6YhhU5AvxLbkLaEVnwfwjyQv3WM30RP28iqieuHf918LXu8z7OKiNPZ0hghu77W_1ed-c' },
    { name: 'Luxor', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95FjX1VoedrbghPkpRqS2iF3Py0j0SZV0jJ8Kzh4r4w&s' },
    { name: 'Aswan', image:'https://www.revigorate.com/images/Great-nile-aswan.jpg'}
  ];

  favoriteIds = new Set<number>();
  private wishlistSub!: Subscription;

  constructor(
    private listingsService: ListingsService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

ngOnInit(): void {
    const listingsCount = 8; // عدد العناصر التي ستظهر في كل carousel

    // جلب البيانات لكل الأقسام
    this.highestRatedListings$ = this.listingsService.getHighestRatedListings(listingsCount);
    this.newestListings$ = this.listingsService.getNewestListings(listingsCount);
    this.mostAffordableListings$ = this.listingsService.getMostAffordableListings(listingsCount);
    this.wishlistSub = this.wishlistService.favoriteIds$.subscribe(ids => {
      this.favoriteIds = ids;
    });
  }

  isListingInFavorites(listingId: number): boolean {
    return this.favoriteIds.has(listingId);
  }

  handleFavoriteToggle(listingId: number): void {
    this.wishlistService.toggleFavorite(listingId).subscribe({
      next: (response) => console.log(`Toggled favorite for listing ${listingId}`),
      error: (err) => console.error('Error toggling favorite', err)
    });
  }

  // دالة للتعامل مع البحث من شريط البحث
  onSearch(filters: any): void {
    // توجيه المستخدم لصفحة عرض الوحدات مع تمرير الفلاتر
    this.router.navigate(['/listings'], { queryParams: filters });
  }

  // دالة للبحث عند الضغط على إحدى الوجهات المميزة
  onDestinationClick(destinationName: string): void {
    this.router.navigate(['/listings'], { queryParams: { governorate: destinationName } });
  }

  ngOnDestroy(): void {
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }
}
