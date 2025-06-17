import { ListingDetailsDto } from './listing-details.model';

export interface BedDto {
  id: number;
  label: string;
  type: string;
  price: number;
  isAvailable: boolean;
  bedPhotos: string[];
  selected?: boolean;
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
