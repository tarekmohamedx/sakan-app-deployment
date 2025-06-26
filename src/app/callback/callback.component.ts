import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css',
})
export class CallbackComponent implements OnInit {
  constructor(
    private googleLoginService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const returnUrl = this.googleLoginService.handleGoogleCallback();
    this.router.navigateByUrl(returnUrl);
  }
}
