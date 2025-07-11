import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BedDTO } from '../../core/models/BedDTO';
import { RoomDTO } from '../../core/models/RoomDTO';
import { BedDialogComponent } from '../host-add-bed/add-bed.component'; // adjust path if needed
import Swal from 'sweetalert2';
import { from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MapSelectorComponentt } from '../../shared/map-selector/map-selector.component';

@Component({
  selector: 'roomdialog',
  templateUrl: './add-room.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  styleUrls: ['./add-room.component.css'],
})
export class RoomDialogComponent {
  roomForm: FormGroup;
  roomPhotos: File[] = [];
  beds: BedDTO[] = [];

 

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoomDialogComponent>,
    private dialog: MatDialog
  ) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      pricePerNight: [0, [Validators.required, Validators.min(0)]],
      maxGuests: [1, Validators.required],
      isBookableAsWhole: [false],
    });
  }

  closeDialog(): void {
    this.dialogRef.close(); // closes without returning data
  }
  // 📸 Room photo validation (type + size)
  onRoomPhotosUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    this.roomPhotos = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!allowedTypes.includes(file.type)) {
          Swal.fire(
            'Invalid File Type',
            `${file.name} is not PNG/JPG`,
            'error'
          );
          continue;
        }

        if (file.size > maxSize) {
          Swal.fire('File Too Large', `${file.name} exceeds 5MB`, 'error');
          continue;
        }

        this.roomPhotos.push(file);
      }
    }
  }

  removePhoto(index: number): void {
    this.roomPhotos.splice(index, 1);
  }

  // 🛏️ Open Bed Dialog
  openAddBedDialog(): void {
   const roomType = this.roomForm.get('type')?.value;
   const currentBedCount = this.beds.length;

   const typeLimits: { [key: string]: number } = {
     single: 1,
     double: 2,
     triple: 3,
     quadra: 4,
   };
   const maxBedsAllowed = typeLimits[roomType?.toLowerCase()] ?? 99;
   if (currentBedCount >= maxBedsAllowed) {
     Swal.fire(
       'Bed Limit Reached',
       `A ${roomType} room can only have ${maxBedsAllowed} bed(s).`,
       'info'
     );
     return;
   }
    const dialogRef = this.dialog.open(BedDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: BedDTO | undefined) => {
      if (result) {
        this.beds.push(result);
      }
    });
  }

  // ✅ Save Room Data to parent component
  saveRoom(): void {
    if (this.roomForm.invalid) {
      Swal.fire(
        'Form Incomplete',
        'Please fill all required room fields.',
        'warning'
      );
      return;
    }

    const room: RoomDTO = {
      ...this.roomForm.value,
      roomPhotos: this.roomPhotos,
      beds: this.beds,
    };

    this.dialogRef.close(room);
  }
}
