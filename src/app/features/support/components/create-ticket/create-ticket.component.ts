import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupportTicketService } from '../../services/support-ticket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent implements OnInit {
ticketForm!: FormGroup;
  isUserLoggedIn = false;
  isLoading = false;
  submissionSuccess = false;
  errorMessage: string | null = null;
  get guestName() { return this.ticketForm.get('guestName'); }
  get guestEmail() { return this.ticketForm.get('guestEmail'); }
  get subject() { return this.ticketForm.get('subject'); }
  get description() { return this.ticketForm.get('description'); }

  constructor(
    private fb: FormBuilder,
    private supportService: SupportTicketService,
    // private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.isUserLoggedIn = this.authService.isAuthenticated();
    this.buildForm();
  }

  buildForm(): void {
    this.ticketForm = this.fb.group({
      guestName: [null, this.isUserLoggedIn ? [] : [Validators.required]],
      guestEmail: [null, this.isUserLoggedIn ? [] : [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['General', Validators.required], // يمكن تغييرها
    });
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.supportService.createTicket(this.ticketForm.value).subscribe({
      next: () => {
        this.submissionSuccess = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "An error occurred. Please try again.";
        this.isLoading = false;
      }
    });
  }
}
