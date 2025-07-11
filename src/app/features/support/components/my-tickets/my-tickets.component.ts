import { Component, OnInit } from '@angular/core';
import { TicketSummaryDto } from '../../../../core/models/support.model';
import { SupportTicketService } from '../../services/support-ticket.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.css'
})
export class MyTicketsComponent implements OnInit{
// مصفوفة لتخزين الشكاوى القادمة من الـ API
  public tickets: TicketSummaryDto[] = [];
  // متغير للتحكم في إظهار مؤشر التحميل
  public isLoading = true;
  // متغير لعرض رسائل الخطأ
  public errorMessage: string | null = null;

  constructor(private supportService: SupportTicketService) { }

  ngOnInit(): void {
    // عند تحميل المكون، نقوم باستدعاء الدالة لجلب الشكاوى
    this.loadUserTickets();
  }

  loadUserTickets(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.supportService.getMyTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load your tickets. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getStatusInfo(status: string): { color: string; icon: string } {
    switch (status.toLowerCase()) {
      case 'open':
      case 'pending':
        return { color: 'blue', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' };
      case 'in progress':
      case 'answered':
        return { color: 'amber', icon: 'M16.023 9.348h4.992v-.001a.75.75 0 01.75.75c0 .414-.336.75-.75.75h-4.992a.75.75 0 01-.75-.75c0-.414.336-.75.75-.75zM4.508 15.652h4.992v.001a.75.75 0 01.75.75c0 .414-.336.75-.75.75H4.508a.75.75 0 01-.75-.75c0-.414.336-.75.75-.75z' };
      case 'closed':
      case 'resolved':
        return { color: 'green', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
      default:
        return { color: 'gray', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' };
    }
  }
}
