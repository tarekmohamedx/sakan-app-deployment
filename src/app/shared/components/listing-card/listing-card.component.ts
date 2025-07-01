import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // ضروري لـ *ngIf والـ pipes
import { ListingSummary } from '../../../core/models/listing.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.css'
})
export class ListingCardComponent {
// --- المدخلات (Inputs) ---

  // المدخل الرئيسي: كائن الوحدة السكنية الكامل
  @Input() listing!: ListingSummary;
  
  // هل هذه الوحدة في المفضلة حالياً؟ (للتحكم في لون أيقونة القلب)
  @Input() isFavorite: boolean = false;
  
  // مدخل للتحكم في إظهار زر الإزالة (سيتم استخدامه في صفحة المفضلة)
  @Input() showRemoveButton: boolean = false;


  // --- المخرجات (Outputs) ---

  // حدث يصدر عند النقر على أيقونة القلب
  @Output() favoriteToggle = new EventEmitter<number>();
  
  // حدث يصدر عند النقر على زر الإزالة
  @Output() removed = new EventEmitter<number>();
  

  // --- دوال التعامل مع الأحداث ---

  // دالة يتم استدعاؤها عند النقر على أيقونة القلب
  onFavoriteClick(event: Event): void {
    event.stopPropagation(); // لمنع الحدث من الوصول للحاوية الرئيسية (يمنع الانتقال لصفحة التفاصيل)
    event.preventDefault();
    this.favoriteToggle.emit(this.listing.id);
  }

  // دالة يتم استدعاؤها عند النقر على زر الإزالة
  onRemoveClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.removed.emit(this.listing.id);
  }
}
