import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../features/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../features/auth/components/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user: { name: string; email: string; id: string; role: string } | null = null;

  constructor(private dialog: MatDialog, private authservice: AuthService) {}

  ngOnInit(): void {
    // Subscribe to login changes (if using BehaviorSubject)
    this.authservice.currentUser$.subscribe((data) => {
      this.user = data;
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent, {
      width: '100%',
      maxWidth: '400px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: true,
    });
  }

  logout() {
    this.authservice.logout();
   // this.user = null;
  }
}
