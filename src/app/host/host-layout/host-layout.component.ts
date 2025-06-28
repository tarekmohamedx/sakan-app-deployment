import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-host-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './host-layout.component.html',
  styleUrl: './host-layout.component.css'
})
export class HostLayoutComponent {
  isSidebarCollapsed: boolean = false;
  showMobileMenu: boolean = false;

  // Fake/mock data (replace with actual logic or services)
  pageTitle: string = 'Dashboard';
  userName: string = 'Tarek Mohamed';
  userInitials: string = this.getInitials(this.userName);
  notificationCount: number = 3;
  unreadCount: number = 5;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.showMobileMenu = this.isSidebarCollapsed;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  logout(): void {
    // Implement actual logout logic here (clear tokens, call service, etc.)
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }

  getInitials(name: string): string {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }
}
