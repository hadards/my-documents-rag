// document.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8000'; // your backend URL
  private documentChanged$ = new BehaviorSubject<void>(undefined);  // 🔔 notify on change

  constructor(private http: HttpClient) {}

  uploadDocument(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('document', file);

    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/upload`, formData).subscribe({
        next: (res) => {
          this.documentChanged$.next(); // 🔔 notify on success
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  askQuestion(question: string, documentIds: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/ask`, { question, documentIds });
  }

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents`);
  }

  onDocumentsChanged(): Observable<void> {
    return this.documentChanged$.asObservable();  // 👂 component listens
  }
}
