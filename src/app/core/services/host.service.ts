import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HostDashboardDTO } from '../models/host-dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class HostDashboardService {
    private readonly apiUrl = 'https://localhost:7188/api';

    constructor(private http: HttpClient) {}

    getDashboardData(hostId:string): Observable<any> {
        return this.http.get<HostDashboardDTO>(`${this.apiUrl}/hostdashboard/${hostId}`);
    }
}