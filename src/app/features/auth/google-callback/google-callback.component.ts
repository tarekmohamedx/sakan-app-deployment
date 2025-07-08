// google-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-google-callback',
  template: `<p>Logging in with Google...</p>`,
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.auth.setLogin(token); // Save token in localStorage/sessionStorage
      this.router.navigate(['/home']); // redirect after login
    } else {
      this.router.navigate(['/login']);
    }
  }
}
