import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';

import Swal from 'sweetalert2';
import { UserProfileDTO } from '../../../../../core/models/UserProfileDTO';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userid!: string;
  defaultImage: string = 'assets/R.png';
  userrole!: string;
  profileData!: UserProfileDTO;
  constructor(
    private route: ActivatedRoute,
    private authservice: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}
   
  ngOnInit(): void {
    this.userid = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID from route: ' + this.userid);
    this.loadProfile();
   // this.userrole = this.authservice.getuserdata()?.role || '';
    console.log('profile data = = ' + this.profileData);
  }

  loadProfile(): void {
    this.authservice.getProfile(this.userid).subscribe({
      next: (data) => {
        if (!data || !data.userName) {
          Swal.fire(
            'Error',
            'Invalid profile data returned from server',
            'error'
          );
          return;
        }

        this.profileData = data;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load profile', 'error');
      },
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '500px',
      data: { ...this.profileData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authservice.updateProfile(this.userid, result).subscribe({
          next: (res) => {
            Swal.fire('Updated!', res.message, 'success'); // res.message is expected
            this.loadProfile();
          },
          error: (err) => {
            console.error('Update error:', err);
            Swal.fire('Error', err?.error?.message || 'Update failed', 'error');
          },
        });
      }
    });
  }

  uploadPhoto(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      this.authservice.uploadUserPhoto(this.userid, formData).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Photo uploaded!', 'success');
          this.loadProfile(); // refresh profile with new image
        },
        error: (err) => {
          Swal.fire('Error', 'Photo upload failed', 'error');
          console.error(err);
        },
      });
    }
  }

  confirmDelete(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete your profile permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authservice.deleteProfile(this.userid).subscribe(() => {
          Swal.fire('Deleted!', 'Your profile has been deleted.', 'success');
          // Optionally redirect or log out the user
          this.authservice.logout();
          this.router.navigate(['/home']);
        });
      }
    });
  }
}
