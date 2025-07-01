import { Injectable } from '@angular/core';
import { CreateListingDTO } from '../../../core/models/CreateListingDTO';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CreatelistingserviceService {
  constructor(private http: HttpClient, private authserice: AuthService) {}

  createListing(dto: CreateListingDTO): Observable<any> {
    const hostId = this.authserice.getuserdata()?.id ?? '';
    const formData = this.buildFormData(dto);
    return this.http.post<any>(
      `${environment.apiurllisting}/${hostId}`,
      formData
    );
  }

  private buildFormData(dto: CreateListingDTO): FormData {
    const formData = new FormData();

    // Basic listing data
    formData.append('Title', dto.title);
    formData.append('Description', dto.description);
    formData.append('PricePerMonth', dto.pricePerMonth.toString());
    formData.append('MaxGuests', dto.maxGuests.toString());
    formData.append('Governorate', dto.governorate);
    formData.append('District', dto.district);
    formData.append('Latitude', dto.latitude.toString());
    formData.append('Longitude', dto.longitude.toString());
    formData.append('IsBookableAsWhole', dto.isBookableAsWhole.toString());

    // Listing Photos
    dto.listingPhotos.forEach((photo) => {
      formData.append('ListingPhotos', photo);
    });

    // Rooms
    dto.rooms.forEach((room, roomIndex) => {
      formData.append(`Rooms[${roomIndex}].Name`, room.name);
      formData.append(`Rooms[${roomIndex}].Type`, room.type);
      formData.append(
        `Rooms[${roomIndex}].PricePerNight`,
        room.pricePerNight.toString()
      );
      formData.append(
        `Rooms[${roomIndex}].MaxGuests`,
        room.maxGuests.toString()
      );
      formData.append(
        `Rooms[${roomIndex}].IsBookableAsWhole`,
        room.isBookableAsWhole.toString()
      );

      // Room Photos
      room.roomPhotos.forEach((photo, photoIndex) => {
        formData.append(`Rooms[${roomIndex}].RoomPhotos`, photo);
      });

      // Beds
      room.beds.forEach((bed, bedIndex) => {
        formData.append(
          `Rooms[${roomIndex}].Beds[${bedIndex}].Label`,
          bed.label
        );
        formData.append(`Rooms[${roomIndex}].Beds[${bedIndex}].Type`, bed.type);
        formData.append(
          `Rooms[${roomIndex}].Beds[${bedIndex}].Price`,
          bed.price.toString()
        );
        formData.append(
          `Rooms[${roomIndex}].Beds[${bedIndex}].IsAvailable`,
          bed.isAvailable.toString()
        );

        // Bed Photos
        bed.bedPhotos.forEach((bedPhoto) => {
          formData.append(
            `Rooms[${roomIndex}].Beds[${bedIndex}].BedPhotos`,
            bedPhoto
          );
        });
      });
    });

    return formData;
  }
}
