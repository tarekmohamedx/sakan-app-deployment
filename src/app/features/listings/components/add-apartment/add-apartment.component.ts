import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { RoomDTO } from '../../../../core/models/RoomDTO';
import { CreateListingDTO } from '../../../../core/models/CreateListingDTO';
import { CreatelistingserviceService } from '../../services/createlistingservice.service';
import { RoomDialogComponent } from '../add-room/add-room.component';
import { MapSelectorComponent } from '../../../../shared/map-selector/map-selector.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-apartment',
  standalone: true,
  imports: [MapSelectorComponent, ReactiveFormsModule, CommonModule],
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
      Swal.fire(
        '❌ Form Invalid',
        'Please fill all required fields.',
        'warning'
      );
      return;
    }

    const formValue = this.listingForm.value;

    const dto: CreateListingDTO = {
      ...formValue,
      listingPhotos: this.listingPhotos,
      rooms: this.rooms,
    };

    this.listingService.createListing(dto).subscribe({
      next: () => {
        Swal.fire('✅ Success', 'Listing created successfully!', 'success');
        this.listingForm.reset();
        this.rooms = [];
        this.listingPhotos = [];
      },
      error: (err) => {
        console.error(err);
        Swal.fire('❌ Error', 'Failed to create listing.', 'error');
      },
    });
  }
}
