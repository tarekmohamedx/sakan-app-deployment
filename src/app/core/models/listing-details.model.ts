import { BedDto } from "./room-details.model";

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
  beds: BedDto[];
  photos: string[];
  selected?: boolean;
}

export interface BookingRequestDto {
  guestId: string;
  listingId?: number;
  roomId?: number;
  bedIds: number[] | null;
  fromDate: string;
  toDate: string;
}

export interface ListingAmenity {
  id: number;
  name: string;
  iconUrl: string;
}

export interface ReviewDto {
  reviewerName: string;
  comment: string;
  rating: number;
  createdAt: string;
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



// import { BedDTO } from './BedDTO';
// export interface RoomDTO {
  //   name: string;
  //   type: string;
  //   pricePerNight: number;
  //   maxGuests: number;
  //   isBookableAsWhole: boolean;
//   roomPhotos: File[];
//   beds: BedDTO[];
// }




// export interface BookingRequestDto {
//   guestId: string;
//   guestName?: string;

//   listingId?: number;
//   listingTitle?: string;

//   roomId?: number;
//   roomName?: string;

//   bedId?: number | null;
//   bedName?: string;

//   fromDate: string; // ISO format
//   toDate: string;
// }








