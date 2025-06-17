import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  constructor(private http: HttpClient) {}

  translate(text: string, targetLang: string) {
    return this.http.get<any>(`/api/translate`, {
      params: {
        text: text,
        lang: targetLang
      }
    });
  }
}
