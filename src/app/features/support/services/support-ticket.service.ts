import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateReplyDto, CreateTicketDto, TicketDetailsDto, TicketSummaryDto } from '../../../core/models/support.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {

  private apiUrl = `${environment.apiurlsupport}`;

  constructor(private http: HttpClient) { }

  // للزوار والمستخدمين
  createTicket(dto: CreateTicketDto): Observable<{ ticketId: number }> {
    return this.http.post<{ ticketId: number }>(this.apiUrl, dto);
  }

  // للمستخدمين المسجلين
  getMyTickets(): Observable<TicketSummaryDto[]> {
    return this.http.get<TicketSummaryDto[]>(`${this.apiUrl}/mytickets`);
  }

  getTicketDetails(ticketId: number): Observable<TicketDetailsDto> {
    return this.http.get<TicketDetailsDto>(`${this.apiUrl}/${ticketId}`);
  }

  addReply(ticketId: number, dto: CreateReplyDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/replies`, dto);
  }

  // للزوار فقط
  getGuestTicketDetails(token: string): Observable<TicketDetailsDto> {
    return this.http.get<TicketDetailsDto>(`${this.apiUrl}/guest/${token}`);
  }

  addGuestReply(token: string, dto: CreateReplyDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/guest/${token}/reply`, dto);
  }
}
