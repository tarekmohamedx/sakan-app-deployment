import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from 'express';
import { AuthService } from '../../features/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { UserBookingRequestsComponent } from '../../features/bookings/components/user-booking-requests.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,UserBookingRequestsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  @ViewChild('dropdownContainer') dropdownContainer?: ElementRef;

  isLoggedIn = false;
  private subscription!: Subscription;

  // isLoggedIn = true;
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  showUserRequestsPopup = false;
  user = {
    name: "",
    profilePictureUrl: ""
  };

  constructor(private authService: AuthService) {}

    ngOnInit(): void {
    const userData = this.authService.getuserdata();
    if (userData) {
      this.isLoggedIn = true;
      this.user = {
        name: userData.name,
        profilePictureUrl: 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png' 
      };
    }
        this.subscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

    logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  openUserRequestsPopup() {
    this.showUserRequestsPopup = true;
  }

  closeUserRequestsPopup() {
    this.showUserRequestsPopup = false;
  }

  // للاستماع لأي نقرة في الصفحة
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    // إذا كانت القائمة مفتوحة والنقرة حدثت خارج حاوية القائمة، قم بإغلاقها
    if (this.isDropdownOpen && !this.dropdownContainer?.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
  // logout(): void {
  //   this.closeDropdown();
  // }

  closeAllMenus(): void {
    this.isMobileMenuOpen = false;
    // this.isDropdownOpen = false; // إذا كان لديك dropdown للديسكتوب
  }

}
