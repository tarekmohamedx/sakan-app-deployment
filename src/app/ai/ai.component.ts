// ai.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-ai',
  standalone: true,
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class AiComponent implements OnInit {
  inputText = '';
  chatHistory: { text: string, sender: 'user' | 'ai' }[] = [];
  sessionList: { id: string, title: string }[] = [];
  currentSessionId: string = '';
  isLoading = false;
  listingSummaries: string[] = [];
  userId: string | null = null;


  constructor(private http: HttpClient) {}

 ngOnInit() {
  this.userId = this.getCurrentUserId();
  if (!this.userId) return;

  this.fetchListingData();

  const sessions = localStorage.getItem(this.getSessionKey(this.userId));
  this.sessionList = sessions ? JSON.parse(sessions) : [];
  if (this.sessionList.length > 0) {
    this.loadSession(this.sessionList[0].id);
  } else {
    this.newChat();
  }
}


  fetchListingData() {
    this.http.get<any[]>('/api/listings/summary').subscribe(data => {
      this.listingSummaries = data.flatMap(l =>
        l.rooms.map((r: any) =>
          `• ${l.title} in ${l.governorate}, ${l.district} - ${r.name} room - ${r.pricePerNight} EGP`
        )
      );
    });
  }

    getToken(): string | null {
    return sessionStorage.getItem('token');
  }

    getCurrentUserId(): string | null {
      const token = this.getToken();
      if (!token) return null;
  
      const decoded = jwtDecode(token) as { [key: string]: any };
      const userId =
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ];
  
      return userId;
    }

  getSessionKey(userId: string): string {
    return `chatSessionList_${userId}`;
  }

  getHistoryKey(sessionId: string, userId: string): string {
    return `chatHistory_${sessionId}_${userId}`;
  }

  newChat() {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    if (this.chatHistory.length > 0) {
      this.saveCurrentSession();
    }
    this.chatHistory = [];
    this.currentSessionId = Date.now().toString();
  }

  sendMessage() {
    const input = this.inputText.trim();
    if (!input) return;

    const userId = this.getCurrentUserId();
    if (!userId) return;

    this.chatHistory.push({ text: input, sender: 'user' });
    this.inputText = '';
    this.isLoading = true;
    this.chatHistory.push({ text: '...', sender: 'ai' });

    const body = {
      messages: this.chatHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    };

    this.http.post<any>('https://localhost:7188/api/ai/ask', body).subscribe({
      next: (res) => {
        this.chatHistory.pop();
        this.chatHistory.push({ text: res.reply, sender: 'ai' });
        this.isLoading = false;
        this.saveCurrentSession();
      },
      error: (err) => {
        this.chatHistory.pop();
        this.chatHistory.push({ text: '⚠️ Error: ' + (err.error?.error?.message || err.message), sender: 'ai' });
        this.isLoading = false;
      }
    });
  }



  saveCurrentSession() {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    localStorage.setItem(this.getHistoryKey(this.currentSessionId, userId), JSON.stringify(this.chatHistory));

    const idx = this.sessionList.findIndex(s => s.id === this.currentSessionId);
    const title = this.chatHistory.find(m => m.sender === 'user')?.text?.slice(0, 30) || 'Chat';
    if (idx === -1) {
      this.sessionList.unshift({ id: this.currentSessionId, title });
    } else {
      this.sessionList[idx].title = title;
    }
    localStorage.setItem(this.getSessionKey(userId), JSON.stringify(this.sessionList));
  }

  loadSession(sessionId: string) {
  if (!this.userId) return;
  this.currentSessionId = sessionId;
  const saved = localStorage.getItem(this.getHistoryKey(sessionId, this.userId));
  this.chatHistory = saved ? JSON.parse(saved) : [];
}

toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar instanceof HTMLElement && overlay instanceof HTMLElement) {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }
}

closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar instanceof HTMLElement && overlay instanceof HTMLElement) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }
}

deleteChat(sessionId: string, event: MouseEvent) {
  event.stopPropagation(); // prevent loading when delete is clicked

  const userId = this.getCurrentUserId();
  if (!userId) return;

  // Remove chat history
  const historyKey = this.getHistoryKey(sessionId, userId);
  localStorage.removeItem(historyKey);

  // Remove from session list
  this.sessionList = this.sessionList.filter(s => s.id !== sessionId);
  localStorage.setItem(this.getSessionKey(userId), JSON.stringify(this.sessionList));

  // If it's the currently open session, start a new chat
  if (this.currentSessionId === sessionId) {
    this.newChat();
  }
}

}
