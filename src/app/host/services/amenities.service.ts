import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface MyJwtPayload {
  nameid: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class amenitiesservice {
  private apiUrl = 'https://localhost:7188/api';

  constructor(private http: HttpClient) {}

  getAllAmenities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/amenities`);
  }
}
