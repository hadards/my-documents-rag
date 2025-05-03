import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    NgxDropzoneModule
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  files: File[] = [];

  constructor(private documentService: DocumentService) {}

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  uploadFiles() {
    for (const file of this.files) {
      this.documentService.uploadDocument(file).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
        },
        error: (error) => {
          console.error('Upload failed', error);
        }
      });
    }
  }
}