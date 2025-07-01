import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HostListingService } from '../services/HostListing.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  newPhotos = '';
  selectedFile: File | null = null;
  imagekitPublicKey = 'public_ZEYX4morpV+ppaWWNVeiDJbO1u8=';
  imagekitUploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hostListingService: HostListingService,
    private toastr: ToastrService,
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
        this.listingForm.patchValue(data);
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load listing.', 'Error');
        this.router.navigate(['/host/listings']);
      }
    });
  }

  removePhoto(index: number): void {
    const photos = this.listingForm.value.photoUrls;
    photos.splice(index, 1);
    this.listingForm.patchValue({ photoUrls: photos });
  }

  addPhotosFromUrl(): void {
    const urls = this.newPhotos.split(',').map(p => p.trim()).filter(p => p);
    this.listingForm.patchValue({
      photoUrls: [...this.listingForm.value.photoUrls, ...urls]
    });
    this.newPhotos = '';
  }

  onFileSelected(event: any): void {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  this.http.post<any>('https://upload.imagekit.io/api/v1/files/upload', formData).subscribe({
    next: res => {
      const imageUrl = res.url;
      this.listingForm.patchValue({
        photoUrls: [...this.listingForm.value.photoUrls, imageUrl]
      });
      this.toastr.success('Photo uploaded!');
    },
    error: err => {
      console.error(err);
      this.toastr.error('Upload failed');
    }
  });
}


  onSubmit(): void {
    if (this.listingForm.valid) {
      this.hostListingService.updateListing(this.listingId, this.listingForm.value).subscribe({
        next: () => {
          this.toastr.success('Listing updated successfully! ✅');
          this.router.navigate(['/host/listings']);
        },
        error: () => this.toastr.error('Failed to update listing ❌', 'Error')
      });
    } else {
      this.toastr.warning('Please fill in all required fields.', 'Form Invalid');
    }
  }
}
