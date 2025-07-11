import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
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
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { amenitiesservice } from '../services/amenities.service';

@Component({
  selector: 'app-add-apartment',
  standalone: true,
  imports: [
    MapSelectorComponentt,
    ReactiveFormsModule,
    CommonModule,
    NgFor,
    NgIf,
    FormsModule,
  ],
  templateUrl: './add-apartment.component.html',
  styleUrl: './add-apartment.component.css',
})
export class AddApartmentComponent implements OnInit {
  listingForm: FormGroup;
  governorates = [
    'Cairo',
    'Giza',
    'Alexandria',
    'Dakahlia',
    'Red Sea',
    'Beheira',
    'Fayoum',
    'Gharbia',
    'Ismailia',
    'Monufia',
    'Minya',
    'Qalyubia',
    'New Valley',
    'Suez',
    'Aswan',
    'Assiut',
    'Beni Suef',
    'Port Said',
    'Damietta',
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

  amenities: any[] = [];
  // selectedAmenities: number[] = [];
  isSubmitting = false;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild(MapSelectorComponentt) mapSelector!: MapSelectorComponentt;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private listingService: CreatelistingserviceService,
    private amenitiesservice: amenitiesservice
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
      amenityIds: [[]],
    });
  }

  ngOnInit(): void {
    this.amenitiesservice.getAllAmenities().subscribe({
      next: (data) => {
        this.amenities = data;
      },
      error: () => {
        Swal.fire('Error', 'Failed to load amenities', 'error');
      },
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
        this.listingForm.value.amenityIds = [];
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
  removePhoto(index: number): void {
    this.listingPhotos.splice(index, 1);
  }
  openAddRoomDialog(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((result: RoomDTO | undefined) => {
      if (result) this.rooms.push(result);
    });
  }

  submitListing(): void {
    if (this.listingForm.invalid) {
      // Show validation error
      return;
    }
    this.isSubmitting = true;

    const dto: CreateListingDTO = {
      ...this.listingForm.value,
      listingPhotos: this.listingPhotos,
      rooms: this.rooms,
      amenityIds: this.listingForm.value.amenityIds,
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
        this.listingForm.value.amenityIds = [];
        this.mapSelector.clearMarker();
      },
      error: (err) => {
        console.error('API Error', err);
        Swal.fire({
          icon: 'error',
          title: '❌ Error',
          html:
            err?.error?.message ||
            JSON.stringify(err?.error?.errors) ||
            'Something went wrong',
        });
        this.isSubmitting = false; // Hide loader on error
      },
      complete: () => {
        this.isSubmitting = false; // Hide loader regardless of success or error
      },
    });
  }
}
