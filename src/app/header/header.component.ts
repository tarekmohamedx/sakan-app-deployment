import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private dialog: MatDialog) {}

  openLoginDialog() {
    this.dialog.open(LoginComponent, {
      width: '100%',
      maxWidth: '400px',
      panelClass: 'custom-dialog-container', // This matches our global class
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: true, // Optional - prevents closing by clicking outside
    });
  }
}
