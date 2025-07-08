import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './features/auth/services/auth.service';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    CommonModule,
    TranslateModule,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  // role = '';
  role: string[] = [];
  constructor(
    private router: Router,
    private authService : AuthService
  ) { 
 
  }


  ngOnInit(): void {
    // this.router.navigate(['/home']);
    console.log('Role', this.authService.getuserdata()?.role);
    this.role = this.authService.getuserdata()?.role || [];
    
  }
  title = 'sakan-app';

  get isHostRoute(): boolean {
    return this.router.url.startsWith('/host');
  }
  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
