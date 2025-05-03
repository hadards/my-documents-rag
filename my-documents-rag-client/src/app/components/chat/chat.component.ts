import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DocumentService } from '../../services/document.service';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  question = '';
  messages: Array<{ text: string; isUser: boolean }> = [];
  selectedDocuments: Array<{ id: string; name: string; selected: boolean }> = [];
  private docSub!: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.loadDocuments();

    // 👂 Listen for document uploads and refresh
    this.docSub = this.documentService.onDocumentsChanged().subscribe(() => {
      this.loadDocuments();
    });
  }

  ngOnDestroy() {
    this.docSub?.unsubscribe();
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (docs) => {
        this.selectedDocuments = docs.map(doc => ({
          ...doc,
          selected: false
        }));
      },
      error: (err) => {
        console.error('Failed to load documents', err);
      }
    });
  }

  sendQuestion() {
    if (!this.question.trim()) return;

    this.messages.push({ text: this.question, isUser: true });

    const selectedIds = this.selectedDocuments
      .filter(doc => doc.selected)
      .map(doc => doc.id);

    this.documentService.askQuestion(this.question, selectedIds)
      .subscribe({
        next: (response) => {
          this.messages.push({ text: response.answer, isUser: false });
        },
        error: () => {
          this.messages.push({
            text: 'Client: Sorry, there was an error processing your question.',
            isUser: false
          });
        }
      });

    this.question = '';
  }
}