// src/app/core/models/UserProfileDTO.ts

export interface UserProfileDTO {
  userID: string;
  userName: string;
  email: string;
  phoneNumber: string;
  // Reservation Info
  fromDate: string; // or Date if parsed
  toDate: string;
  userImageURL: string;
  // Listing Info
  title: string;
  description: string;
  price: number;
}
