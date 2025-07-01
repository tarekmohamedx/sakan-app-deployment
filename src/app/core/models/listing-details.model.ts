export interface ListingDetailsDto {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  bedroomList: RoomDto[];
  host: HostInfo;
}

export interface RoomDto {
  id: number;
  name: string;
  pricePerNight: number | null;
  photos: string[];
    selected?: boolean;
}

export interface HostInfo {
  name: string;
  // photoUrl: string;
  // reviews: number;
  // rating: number;
  // monthsHosting: number;
  // location: string;
  // responseRate: number;
  // responseTime: string;
  // languages: string[];
}

export interface BookingRequestDto {
  guestId: string;
  listingId?: number;
  roomId?: number;
  bedId?: number | null;
  fromDate: string; // ISO format
  toDate: string;
}





