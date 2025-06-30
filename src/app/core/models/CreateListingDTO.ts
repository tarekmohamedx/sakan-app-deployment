import { RoomDTO } from './RoomDTO';

export interface CreateListingDTO {
  title: string;
  description: string;
  pricePerMonth: number;
  maxGuests: number;
  governorate: string;
  district: string;
  latitude: number;
  longitude: number;
  isBookableAsWhole: boolean;
  listingPhotos: File[];
  rooms: RoomDTO[];
}
