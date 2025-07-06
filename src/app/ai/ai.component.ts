import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AiComponent {
  inputText: string = '';
  generatedResponse: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAiResponse() {
    if (!this.inputText.trim()) {
      this.toastr.warning('Please enter a message');
      return;
    }

    this.isLoading = true;
    this.http.post<{ response: string }>('https://localhost:7188/api/ai/generate-response', {
      inputText: this.inputText
    }).subscribe({
      next: res => {
        this.generatedResponse = res.response;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to get AI response');
        this.isLoading = false;
      }
    });
  }
}
