export interface FilterParams {
  // Location Filters
  northEastLat?: number;
  northEastLng?: number;
  southWestLat?: number;
  southWestLng?: number;
  governorate?: string;

  // Price Filter
  minPrice?: number;
  maxPrice?: number;

  // Availability Filter
  checkInDate?: string; // سنرسله كنص بصيغة 'YYYY-MM-DD'
  checkOutDate?: string;

  // Rating Filter
  minRating?: number; // 

  // Other Filters
  propertyType?: string;
  genderPolicy?: string;
  amenityIds?: number[]; // مصفوفة من الأرقام
  roomType?: string; 
  // Sorting
  sortBy?: string; // 'price_asc', 'rating_desc', etc.

  // Pagination
  pageNumber?: number;
  pageSize?: number;
}
