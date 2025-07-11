import { Component, OnInit } from '@angular/core';
import { TicketDetailsDto, TicketReplyDto } from '../../../../core/models/support.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SupportTicketService } from '../../services/support-ticket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent implements OnInit {
ticket: TicketDetailsDto | null = null;
  replyForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  
  private ticketId: number | null = null;
  private guestToken: string | null = null;
  private currentUserName = "Current User Name"; 
  constructor(
    private route: ActivatedRoute,
    private supportService: SupportTicketService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildReplyForm();
    
    // التحقق إذا كان المسار للزائر أم للمستخدم المسجل
    if (this.route.snapshot.paramMap.has('token')) {
      this.guestToken = this.route.snapshot.paramMap.get('token');
      this.loadGuestTicket();
    } else {
      this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
      this.loadTicketDetails();
    }
  }

  loadTicketDetails(): void {
    this.supportService.getTicketDetails(this.ticketId!).subscribe(data => this.ticket = data);
  }
  
  loadGuestTicket(): void {
    this.supportService.getGuestTicketDetails(this.guestToken!).subscribe(data => this.ticket = data);
  }
  
  buildReplyForm(): void {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  onReplySubmit(): void {
    if (this.replyForm.invalid) return;
    this.isLoading = true;
    this.isSubmitting = true;

    const replyDto = this.replyForm.value;

    const replyObservable = this.guestToken 
      ? this.supportService.addGuestReply(this.guestToken, replyDto)
      : this.supportService.addReply(this.ticketId!, replyDto);

    replyObservable.subscribe(() => {
      this.isLoading = false;
      this.isSubmitting = false;
      this.replyForm.reset();
      // إعادة تحميل البيانات لإظهار الرد الجديد
      this.guestToken ? this.loadGuestTicket() : this.loadTicketDetails();
    });
  }

  isMyReply(reply: TicketReplyDto): boolean {
    // قارن اسم كاتب الرد باسم المستخدم الحالي
    // في حالة الزائر, قد لا يكون هناك اسم للمستخدم الحالي
    if (this.guestToken) {
       // بالنسبة للزائر, يمكن اعتبار كل ردوده هي "my reply" إذا كان اسم الكاتب هو نفسه اسم مقدم الشكوى
       return reply.authorName === this.ticket?.submitterName;
    }
    return reply.authorName === this.currentUserName;
  }
}
