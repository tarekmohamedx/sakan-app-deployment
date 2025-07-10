import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BedDTO } from '../../core/models/BedDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'beddialog',
  templateUrl: './add-bed.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./add-bed.component.css'],
})
export class BedDialogComponent {
  bedForm: FormGroup;
  bedPhotos: File[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BedDialogComponent>
  ) {
    this.bedForm = this.fb.group({
      label: ['', Validators.required],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      isAvailable: [true],
    });
  }

  // 📸 Handle image file upload
  onBedPhotosUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    this.bedPhotos = [];

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

        this.bedPhotos.push(file);
      }
    }
  }
  removePhoto(index: number): void {
    this.bedPhotos.splice(index, 1);
  }

  // ✅ Finalize and return the bed object
  saveBed(): void {
    if (this.bedForm.invalid) {
      Swal.fire(
        'Incomplete Form',
        'Please fill all required fields.',
        'warning'
      );
      return;
    }

    const bed: BedDTO = {
      ...this.bedForm.value,
      bedPhotos: this.bedPhotos,
    };

    this.dialogRef.close(bed);
  }
  closeDialog(): void {
    this.dialogRef.close(); // closes without returning data
  }
}
