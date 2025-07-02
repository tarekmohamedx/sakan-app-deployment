
export interface ListingSummary {
  id: number;
  title: string;
  startingPrice: number | null; // <-- تعديل: قد تكون القيمة رقم أو null
  mainPhotoUrl: string | null;  // <-- تعديل: قد تكون القيمة نص أو null
  averageRating: number;
  governorate: string | null;   // <-- تعديل: قد تكون القيمة نص أو null
  district: string | null;      // <-- إضافة: من المفيد إضافته للعرض
}