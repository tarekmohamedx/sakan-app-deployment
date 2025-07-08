import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { RoomDTO } from '../../core/models/RoomDTO';
import { CreateListingDTO } from '../../core/models/CreateListingDTO';
import { CreatelistingserviceService } from '../services/createlistingservice.service';
import { RoomDialogComponent } from '../host-add-room/add-room.component';
import { MapSelectorComponentt } from '../../shared/map-selector/map-selector.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-apartment',
  standalone: true,
  imports: [MapSelectorComponentt, ReactiveFormsModule, CommonModule],
  templateUrl: './add-apartment.component.html',
  styleUrl: './add-apartment.component.css',
})
export class AddApartmentComponent {
  listingForm: FormGroup;
  governorates = [
    'Cairo',
    'Giza',
    'Alexandria',
    'Dakahlia',
    'Red Sea',
    'Beheira',
    'Fayoum',
    'Gharbiya',
    'Ismailia',
    'Monufia',
    'Minya',
    'Qaliubiya',
    'New Valley',
    'Suez',
    'Aswan',
    'Assiut',
    'Beni Suef',
    'Port Said',
    'Damietta',
    'Sharkia',
    'South Sinai',
    'Kafr El Sheikh',
    'Matrouh',
    'Luxor',
    'Qena',
    'North Sinai',
    'Sohag',
  ];

  listingPhotos: File[] = [];
  rooms: RoomDTO[] = [];

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild(MapSelectorComponentt) mapSelector!: MapSelectorComponentt;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private listingService: CreatelistingserviceService
  ) {
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      pricePerMonth: [0, [Validators.required, Validators.min(0)]],
      maxGuests: [1, Validators.required],
      governorate: ['', Validators.required],
      district: [''],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      isBookableAsWhole: [false],
    });
  }

  triggerFileUpload(): void {
    this.fileInputRef.nativeElement.click();
  }

  cancelForm(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will reset the entire form.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listingForm.reset();
        this.rooms = [];
        this.listingPhotos = [];
        Swal.fire('Reset!', 'The form has been cleared.', 'success');
      }
    });
  }

  onPhotoUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!allowedTypes.includes(file.type)) {
          Swal.fire(
            '❌ Invalid File Type',
            `${file.name} is not PNG/JPG`,
            'error'
          );
          continue;
        }

        if (file.size > maxSize) {
          Swal.fire('❌ File Too Large', `${file.name} exceeds 5MB`, 'error');
          continue;
        }

        // Only add if not already in the array (optional)
        if (
          !this.listingPhotos.some(
            (p) => p.name === file.name && p.size === file.size
          )
        ) {
          this.listingPhotos.push(file);
        }
      }
    }
  }

  setCoords(coords: { lat: number; lng: number }) {
    this.listingForm.patchValue({
      latitude: coords.lat,
      longitude: coords.lng,
    });
  }

  openAddRoomDialog(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: RoomDTO | undefined) => {
      if (result) {
        this.rooms.push(result);
      }
    });
  }

  submitListing(): void {
    if (this.listingForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Invalid',
        html: `<ul style="text-align:left;">
          ${Object.entries(this.listingForm.controls)
            .filter(([_, control]) => control.invalid)
            .map(
              ([name, control]) =>
                `<li><strong>${name}</strong>: ${
                  control.errors?.['required']
                    ? 'This field is required.'
                    : control.errors?.['min']
                    ? 'Value is too low.'
                    : 'Invalid input.'
                }</li>`
            )
            .join('')}
        </ul>`,
      });
      return;
    }
  
    const dto: CreateListingDTO = {
      ...this.listingForm.value,
      listingPhotos: this.listingPhotos,
      rooms: this.rooms,
    };
  
    this.listingService.createListing(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '✅ Listing Created!',
          text: 'Your apartment listing has been successfully created.',
        });
        this.listingForm.reset();
        this.rooms = [];
        this.listingPhotos = [];
        this.mapSelector.clearMarker();
      },
      error: (err) => {
        console.error('API Error', err);
  
        let errorHtml = '';
  
        // Server-specific handling
        if (err.status === 0) {
          errorHtml = 'Cannot reach server. Check your internet or API is down.';
        } else if (err.status === 404) {
          errorHtml = 'API endpoint not found (404). Check URL or route parameter.';
        } else if (err.status === 415) {
          errorHtml =
            'Unsupported Media Type (415). Make sure you are sending FormData and not JSON.';
        } else if (err.status === 400 && typeof err.error === 'object') {
          const messages = [];
  
          if (err.error.message) {
            messages.push(`<li><strong>Message:</strong> ${err.error.message}</li>`);
          }
  
          if (err.error.errors) {
            for (const key in err.error.errors) {
              const msgs = err.error.errors[key];
              messages.push(`<li><strong>${key}</strong>: ${msgs.join(', ')}</li>`);
            }
          }
  
          errorHtml = `<ul style="text-align:left">${messages.join('')}</ul>`;
        } else if (typeof err.error === 'string') {
          errorHtml = err.error;
        } else {
          errorHtml = 'An unexpected error occurred.';
        }
  
        Swal.fire({
          icon: 'error',
          title: '❌ API Error',
          html: `<div style="text-align:left">${errorHtml}</div>`,
        });
      },
    });
  }
  
}
