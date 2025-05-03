import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { UploadComponent } from './components/upload/upload.component';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, UploadComponent, ChatComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-documents-rag';
}
