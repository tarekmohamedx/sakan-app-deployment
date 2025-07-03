import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from 'express';
import { AuthService } from '../../features/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('dropdownContainer') dropdownContainer?: ElementRef;

  isLoggedIn = true;
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  user = {
    name: "amira",
    profilePictureUrl: "data:image/jpeg;base64,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"
  };
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // للاستماع لأي نقرة في الصفحة
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    // إذا كانت القائمة مفتوحة والنقرة حدثت خارج حاوية القائمة، قم بإغلاقها
    if (this.isDropdownOpen && !this.dropdownContainer?.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
  logout(): void {
    this.closeDropdown(); // أغلق القائمة قبل تسجيل الخروج

  }
  closeAllMenus(): void {
    this.isMobileMenuOpen = false;
    // this.isDropdownOpen = false; // إذا كان لديك dropdown للديسكتوب
  }

}
