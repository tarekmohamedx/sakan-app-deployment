import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';

// استيراد المكتبات والمكونات
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxSliderModule, Options } from 'ngx-slider-v2';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as L from 'leaflet';

// استيراد الواجهات والخدمات
import { FilterParams } from '../../../core/models/filter-params.model';
import { Amenity } from '../../../core/models/amenity.model';
import { ListingsService } from '../../../features/listings/services/listings.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, NgxSliderModule, LeafletModule, NgxDaterangepickerMd ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Output() searchTriggered = new EventEmitter<FilterParams>();
  @ViewChild('searchBarContainer') searchBarContainer!: ElementRef;

  // --- 1. إدارة الحالة ---
  searchForm!: FormGroup;
  activePopover: 'location' | 'dates' | 'advanced' | null = null;
  isMobileFiltersOpen = false;

  // --- 2. بيانات الفلاتر ---
  allAmenities: Amenity[] = [];
  selectedDateRange: string = '';
  advancedFiltersSummary: string = '';

  allGovernorates: string[] = [
    'Cairo', 'Giza', 'Alexandria', 'Aswan', 'Luxor', 'Sharm El Sheikh', 'Hurghada',
    'Dakahlia', 'Sharqia', 'Qalyubia', 'Beheira', 'Monufia', 'Gharbia',
    'Kafr El Sheikh', 'Damietta', 'Port Said', 'Ismailia', 'Suez', 'Faiyum',
    'Beni Suef', 'Minya', 'Asyut', 'Sohag', 'Qena', 'Red Sea', 'New Valley',
    'Matrouh', 'North Sinai', 'South Sinai'
  ];
  filteredGovernorates: string[] = [];

  // --- 3. إعدادات المكتبات ---
  map!: L.Map;
  mapOptions: L.MapOptions = { layers: [L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' })], zoom: 11, center: L.latLng(30.0444, 31.2357) };
  priceSliderOptions: Options = { floor: 0, ceil: 10000, step: 100, translate: (v) => `EGP ${v}` };
  datePickerOptions: any = { alwaysShowCalendars: true, autoApply: true, opens: 'center'};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private listingsService: ListingsService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.loadAmenities();

      this.searchForm.get('governorate')?.valueChanges.subscribe(value => {
      if (value) {
        this.filteredGovernorates = this.allGovernorates.filter(gov =>
          gov.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        // إذا كان الحقل فارغاً، لا تعرض أي اقتراحات أو اعرض القائمة كاملة
        this.filteredGovernorates = []; 
      }
    });

    this.searchForm.valueChanges.pipe(
      debounceTime(300) // انتظر قليلاً بعد الكتابة قبل التحديث لتجنب التحديث المفرط
    ).subscribe(values => {
        this.updateSummaries(values);
    });
  }

    selectGovernorate(governorate: string): void {
    this.searchForm.get('governorate')?.setValue(governorate);
    this.filteredGovernorates = []; // إخفاء قائمة الاقتراحات بعد الاختيار
  }

  // --- 4. بناء الفورم ---
  buildForm(): void {
    this.searchForm = this.fb.group({
      governorate: [''], checkInDate: [null], checkOutDate: [null],
      minPrice: [0], maxPrice: [10000], minRating: [null],
      roomType: [null], amenityIds: this.fb.group({}),
      northEastLat: [null], northEastLng: [null], southWestLat: [null], southWestLng: [null],
    });
  }

  // --- 5. دوال التحكم بالواجهة ---
  togglePopover(event: Event, popoverName: 'location' | 'dates' | 'advanced') {
    event.stopPropagation();
    this.activePopover = this.activePopover === popoverName ? null : popoverName;
  }
  
  closePopover() { this.activePopover = null; }
  openMobileFilters() { this.isMobileFiltersOpen = true; }
  
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.activePopover && !this.searchBarContainer.nativeElement.contains(event.target)) {
      this.closePopover();
    }

    if (this.filteredGovernorates.length > 0 && !this.searchBarContainer.nativeElement.contains(event.target)) {
      this.filteredGovernorates = [];
  }
  }

  // --- 6. دوال التعامل مع المكتبات والبيانات ---
  loadAmenities(): void {
    this.listingsService.getAllAmenities().subscribe(amenities => {
      this.allAmenities = amenities;
      this.addAmenityControls();
    });
    console.log(this.allAmenities);
    
  }

  addAmenityControls(): void {
    const amenityGroup = this.searchForm.get('amenityIds') as FormGroup;
    this.allAmenities.forEach(amenity => {
      amenityGroup.addControl(amenity.id.toString(), this.fb.control(false));
    });
  }

  onMapReady(map: L.Map) { this.map = map; setTimeout(() => map.invalidateSize(), 100); }

  onDatesSelected(event: { startDate: any, endDate: any }): void {
    const { startDate, endDate } = event;
    if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
      this.searchForm.patchValue({
        checkInDate: startDate.format('YYYY-MM-DD'),
        checkOutDate: endDate.format('YYYY-MM-DD')
      });
      this.closePopover();
    }
  }

  selectRating(rating: number | null): void {
    this.searchForm.get('minRating')?.setValue(rating);
    // لا نغلق النافذة هنا، ليتمكن المستخدم من اختيار فلاتر أخرى
  }

  // --- 7. منطق التحديث والبحث ---
  updateSummaries(values: any): void {
    // تحديث ملخص التاريخ
    if (values.checkInDate && values.checkOutDate) {
        this.selectedDateRange = `${values.checkInDate} to ${values.checkOutDate}`;
    } else {
        this.selectedDateRange = 'Add dates';
    }

    // تحديث ملخص الفلاتر المتقدمة
    const parts: string[] = [];
    if (values.minPrice > 0 || values.maxPrice < 10000) parts.push(`Price: ${values.minPrice}-${values.maxPrice}`);
    if (values.minRating) parts.push(`${values.minRating}+ Rating`);
    if (values.roomType) parts.push(values.roomType);
    const amenityCount = Object.values(values.amenityIds).filter(v => v).length;
    if (amenityCount > 0) parts.push(`${amenityCount} Amenities`);
    
    this.advancedFiltersSummary = parts.join(' • ') || 'Price, Room, ...';
  }

  onSearch() {
  const formValue = this.searchForm.getRawValue();
  const filterParams: any = {};

  // --- 1. منطق الموقع الحصري (نسخة محسّنة بالأولويات) ---
  const hasGovernorateInput = formValue.governorate && formValue.governorate.trim().length > 0;
  const isLocationPopoverActive = this.activePopover === 'location' && this.map;

  // الأولوية الأولى: إذا كان هناك نص في حقل المحافظة، استخدمه دائمًا.
  if (hasGovernorateInput) {
    filterParams.governorate = formValue.governorate.trim();
  }
  // الأولوية الثانية: إذا لم يكن هناك نص، وكانت نافذة الخريطة مفتوحة، استخدم الخريطة.
  else if (isLocationPopoverActive) {
    const bounds = this.map.getBounds();
    filterParams.northEastLat = bounds.getNorthEast().lat;
    filterParams.northEastLng = bounds.getNorthEast().lng;
    filterParams.southWestLat = bounds.getSouthWest().lat;
    filterParams.southWestLng = bounds.getSouthWest().lng;
  }
  // إذا لم يتحقق أي شرط، لا يتم إضافة باراميتر للموقع.

  // --- 2. إضافة باقي الفلاتر ---
  if (formValue.checkInDate) {
    filterParams.checkInDate = formValue.checkInDate;
  }
  if (formValue.checkOutDate) {
    filterParams.checkOutDate = formValue.checkOutDate;
  }
  // ... (باقي الفلاتر كما هي)
  if (formValue.minPrice > 0) {
    filterParams.minPrice = formValue.minPrice;
  }
  if (formValue.maxPrice < 10000) {
    filterParams.maxPrice = formValue.maxPrice;
  }
  if (formValue.minRating) {
    filterParams.minRating = formValue.minRating;
  }
  if (formValue.roomType) {
    filterParams.roomType = formValue.roomType;
  }
  
  // --- 3. إضافة المرافق (Amenities) ---
  const selectedAmenityIds = Object.keys(formValue.amenityIds)
                                 .filter(key => formValue.amenityIds[key])
                                 .map(Number);
  if (selectedAmenityIds.length > 0) {
    filterParams.amenityIds = selectedAmenityIds;
  }

  // --- 4. إغلاق الواجهة وتنفيذ التوجيه ---
  this.closePopover();
  this.isMobileFiltersOpen = false;
  
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: filterParams,
  });
}

  resetFilters(): void {
  this.searchForm.reset({
    governorate: '',
    minPrice: 0,
    maxPrice: 10000,
    // ... ضع القيم الافتراضية هنا
  });
  // أعد تعيين amenity checkboxes يدوياً
  const amenityGroup = this.searchForm.get('amenityIds') as FormGroup;
  Object.keys(amenityGroup.controls).forEach(key => {
    amenityGroup.get(key)?.setValue(false);
  });
}
}
