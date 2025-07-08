import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HostListingService } from '../services/HostListing.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-host-listings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-host-listings.component.html',
  styleUrl: './edit-host-listings.component.css'
})
export class EditHostListingComponent implements OnInit {
  listingForm: FormGroup;
  listingId!: number;
  isLoading = true;
  photoUrls: string[] = [];
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hostListingService: HostListingService,
    private http: HttpClient
  ) {
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      pricePerMonth: ['', Validators.required],
      maxGuests: ['', Validators.required],
      governorate: [''],
      district: [''],
      isBookableAsWhole: [false],
      isActive: [true],
      photoUrls: this.fb.control<string[]>([])
    });
  }

  ngOnInit(): void {
    this.listingId = +this.route.snapshot.paramMap.get('id')!;
    this.loadListing();
  }

  loadListing(): void {
    this.hostListingService.getListingById(this.listingId).subscribe({
      next: (data) => {
        this.photoUrls = data.photoUrls || [];
        this.listingForm.patchValue({ ...data, photoUrls: this.photoUrls });
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Error', 'Failed to load listing.', 'error');
        this.router.navigate(['/host/listings']);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  uploadSelectedPhotos(): void {
    if (this.selectedFiles.length === 0) return;

    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('listingPhotos', file));

    this.http.post<string[]>('https://localhost:7188/api/upload/upload', formData).subscribe({
      next: (urls) => {
        this.photoUrls.push(...urls);
        this.listingForm.patchValue({ photoUrls: this.photoUrls });
        Swal.fire('Success', 'Photos uploaded successfully ✅', 'success');
        this.selectedFiles = [];
      },
      error: () => Swal.fire('Error', 'Failed to upload photos ❌', 'error')
    });
  }

  removePhoto(index: number): void {
    this.photoUrls.splice(index, 1);
    this.listingForm.patchValue({ photoUrls: this.photoUrls });
  }

  onSubmit(): void {
    if (!this.listingForm.valid) {
      Swal.fire('Warning', 'Please complete the required fields.', 'warning');
      return;
    }

    this.listingForm.patchValue({ photoUrls: this.photoUrls });

    this.hostListingService.updateListing(this.listingId, this.listingForm.value).subscribe({
      next: () => {
        Swal.fire('Success', 'Listing updated ✅', 'success');
        this.router.navigate(['/host/listings']);
      },
      error: () => Swal.fire('Error', 'Failed to update listing ❌', 'error')
    });
  }
}
