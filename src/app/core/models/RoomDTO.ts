import { BedDTO } from './BedDTO';

export interface RoomDTO {
  name: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
  isBookableAsWhole: boolean;
  roomPhotos: File[];
  beds: BedDTO[];
}
