import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnChanges {
@Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() maxVisiblePages: number = 7; // العدد الأقصى للأزرار التي ستظهر (يجب أن يكون فردياً)

  // --- المخرجات (Outputs) ---
  @Output() pageChange = new EventEmitter<number>();

  // مصفوفة لتخزين أرقام الصفحات التي سيتم عرضها (e.g., [1, '...', 4, 5, 6, '...', 10])
  public pages: (number | string)[] = [];

  // OnChanges يتم استدعاؤه كلما تغيرت قيمة أي @Input
  ngOnChanges(changes: SimpleChanges): void {
    // إعادة بناء مصفوفة الصفحات فقط إذا تغيرت الصفحة الحالية أو العدد الإجمالي
    if (changes['currentPage'] || changes['totalPages']) {
      this.pages = this.generatePagesArray();
    }
  }

  // دالة يتم استدعاؤها عند النقر على أي زر
  selectPage(page: number | string): void {
    // تأكد من أن العنصر المضغوط عليه هو رقم وأنه ليس الصفحة الحالية
    if (typeof page === 'number' && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
  
  // دالة للذهاب للصفحة السابقة
  goToPrevious(): void {
    if (this.currentPage > 1) {
      this.selectPage(this.currentPage - 1);
    }
  }

  // دالة للذهاب للصفحة التالية
  goToNext(): void {
    if (this.currentPage < this.totalPages) {
      this.selectPage(this.currentPage + 1);
    }
  }

  // دالة لتوليد أرقام الصفحات بشكل ذكي
  private generatePagesArray(): (number | string)[] {
    if (this.totalPages <= 1) {
      return [];
    }

    // إذا كان العدد الإجمالي للصفحات صغيراً، اعرضها كلها
    if (this.totalPages <= this.maxVisiblePages) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    
    const sidePages = Math.floor((this.maxVisiblePages - 3) / 2);
    const pagesToShow: (number | string)[] = [];

    // الحالة التي تكون فيها الصفحة الحالية قريبة من البداية
    if (this.currentPage <= sidePages + 2) {
      for (let i = 1; i <= this.maxVisiblePages - 2; i++) {
        pagesToShow.push(i);
      }
      pagesToShow.push('...');
      pagesToShow.push(this.totalPages);
    } 
    // الحالة التي تكون فيها الصفحة الحالية قريبة من النهاية
    else if (this.currentPage >= this.totalPages - sidePages - 1) {
      pagesToShow.push(1);
      pagesToShow.push('...');
      for (let i = this.totalPages - (this.maxVisiblePages - 3); i <= this.totalPages; i++) {
        pagesToShow.push(i);
      }
    } 
    // الحالة التي تكون فيها الصفحة الحالية في المنتصف
    else {
      pagesToShow.push(1);
      pagesToShow.push('...');
      for (let i = this.currentPage - sidePages; i <= this.currentPage + sidePages; i++) {
        pagesToShow.push(i);
      }
      pagesToShow.push('...');
      pagesToShow.push(this.totalPages);
    }

    return pagesToShow;
  }
}
