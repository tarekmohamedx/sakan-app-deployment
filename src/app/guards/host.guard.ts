import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HostGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRoleFromToken();
    if (role === 'host') {
      return true;
    }

    // Redirect if not a host
    this.router.navigate(['/home']);
    return false;
  }
}
