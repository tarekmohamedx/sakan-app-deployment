import { ListingDetailsDto } from './listing-details.model';


export interface HostRoomDto {
  id: number;
  listingId: number;
  name: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
  isBookableAsWhole: boolean;
  isActive: boolean;
  photoUrls: string[];
  listingTitle: string;
  beds: BedDto[];
}
export interface RoomDetailsDto {
  id: number;
  listingId: number;
  name: string;
  pricePerNight: number;
  type: string;
  maxGuests: number;
  isBookableAsWhole: boolean;
  photos: string[];
  beds: BedDto[];
  listing: {
    latitude: number;
    longitude: number;
  };
}
export interface BedDto {
  id: number | null;
  label: string;
  type: string;
  price: number;
  isAvailable: boolean;
  bedPhotos: string[];
  selected?: boolean;
}

