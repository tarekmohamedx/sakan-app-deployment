import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { ListingSummary } from '../../../../core/models/listing.model';
import { map, Observable } from 'rxjs';
import { ListingCardComponent } from '../../../../shared/components/listing-card/listing-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, ListingCardComponent],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css'
})
export class WishlistPageComponent implements OnInit{
  wishlistItems$!: Observable<ListingSummary[]>;

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    // جلب قائمة المفضلة من الخدمة
    this.wishlistItems$ = this.wishlistService.getUserFavorites();
  }

  // عند إزالة عنصر، يمكننا إعادة تحميل القائمة
  handleRemoveFromWishlist(listingId: number): void {
    this.wishlistService.toggleFavorite(listingId).subscribe();
      // إعادة تحميل القائمة بعد الحذف
      this.wishlistItems$ = this.wishlistItems$.pipe(
      map(listings => listings.filter(l => l.id !== listingId))
    );
  }
}
