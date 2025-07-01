import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ListingSummary} from '../../../core/models/listing.model';
import { PagedResult} from '../../../core/models/paged-result.model';
import {FilterParams } from '../../../core/models/filter-params.model';
import { environment } from '../../../environments/environment';
import { Amenity } from '../../../core/models/amenity.model';

@Injectable({
  providedIn: 'root'
})
export class ListingsService {
 // الرابط الأساسي للـ API يتم قراءته من ملفات البيئة
  private apiUrl = `${environment.apiurlauth}/listings`;
private apiUrl2 = `${environment.apiurlauth}`;
  constructor(private http: HttpClient) { }

  /**
   * يجلب كل الوحدات السكنية المعتمدة مع دعم الترقيم.
   * يتصل بـ: GET /api/listings
   * @param pageNumber رقم الصفحة المطلوبة.
   * @param pageSize عدد العناصر في كل صفحة.
   * @returns Observable يحتوي على PagedResult من ListingSummary.
   */
  getAllListings(pageNumber: number, pageSize: number): Observable<PagedResult<ListingSummary>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ListingSummary>>(this.apiUrl, { params });
  }

  /**
   * يجلب قائمة مفلترة من الوحدات السكنية مع دعم الترقيم والترتيب.
   * يتصل بـ: GET /api/listings/filter
   * @param filters كائن يحتوي على كل معايير البحث والفلترة.
   * @returns Observable يحتوي على PagedResult من ListingSummary.
   */
  getFilteredListings(filters: FilterParams): Observable<PagedResult<ListingSummary>> {
    let params = new HttpParams();

    // بناء الـ HttpParams ديناميكياً من كائن الفلاتر
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          // للتعامل مع فلتر المرافق (amenityIds)
          value.forEach(item => {
            params = params.append(key, item);
          });
        } else {
          params = params.append(key, value.toString());
        }
      }
    });

    return this.http.get<PagedResult<ListingSummary>>(`${this.apiUrl}/filter`, { params });
  }


  // ==========================================================
  //      الدوال الخاصة بالصفحة الرئيسية (Homepage)
  // ==========================================================

  /**
   * يجلب قائمة بأعلى الوحدات تقييماً.
   * يتصل بـ: GET /api/listings/homepage/highest-rated
   * @param count عدد الوحدات المطلوب جلبها.
   * @returns Observable يحتوي على قائمة من ListingSummary.
   */
  getHighestRatedListings(count: number): Observable<ListingSummary[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<ListingSummary[]>(`${this.apiUrl}/homepage/highest-rated`, { params });
  }

  /**
   * يجلب قائمة بأحدث الوحدات المضافة.
   * يتصل بـ: GET /api/listings/homepage/newest
   * @param count عدد الوحدات المطلوب جلبها.
   * @returns Observable يحتوي على قائمة من ListingSummary.
   */
  getNewestListings(count: number): Observable<ListingSummary[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<ListingSummary[]>(`${this.apiUrl}/homepage/newest`, { params });
  }

  /**
   * يجلب قائمة بأرخص الوحدات سعراً.
   * يتصل بـ: GET /api/listings/homepage/most-affordable
   * @param count عدد الوحدات المطلوب جلبها.
   * @returns Observable يحتوي على قائمة من ListingSummary.
   */
  getMostAffordableListings(count: number): Observable<ListingSummary[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<ListingSummary[]>(`${this.apiUrl}/homepage/most-affordable`, { params });
  }

  // يمكنكِ إضافة دالة لجلب تفاصيل وحدة واحدة هنا مستقبلاً
  // getListingDetails(id: number): Observable<ListingDetailsDto> {
  //   return this.http.get<ListingDetailsDto>(`${this.apiUrl}/${id}`);
  // }

  getAllAmenities(): Observable<Amenity[]> {
    // نقوم بعمل طلب GET بسيط للـ endpoint الخاص بالـ amenities
    return this.http.get<Amenity[]>(`${this.apiUrl2}/amenities`);
  }
}
