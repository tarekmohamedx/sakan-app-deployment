import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminHost {
  id: string;
  userName: string;
  email: string;
  hostVerificationStatus: string;
}

export interface AdminHostApprovalDto {
  userId: string;
  action: 'approve' | 'reject';
}

@Injectable({
  providedIn: 'root'
})
export class AdminHostApproveService {
  private apiUrl = 'https://localhost:7188/api/admin';

  constructor(private http: HttpClient) {}

  /** Get all users with host requests (pending, accepted, rejected) */
  getHosts(): Observable<AdminHost[]> {
    return this.http.get<AdminHost[]>(`${this.apiUrl}/hosts`);
  }

  /** Approve or reject a host */
  approveOrRejectHost(dto: AdminHostApprovalDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/approve-host`, dto);
  }
}
