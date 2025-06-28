import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DialogService } from '../../services/dialogService';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  
  @ViewChild('dialogContainer', { read: ViewContainerRef }) dialogContainer!: ViewContainerRef;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  ngAfterViewInit(): void {
    // Assurez-vous que dialogContainer est disponible avant de le passer
    if (this.dialogContainer) {
      this.dialogService.setDialogHost(this.dialogContainer);
      console.log('Dialog host set successfully.');
    } else {
      console.error('dialogContainer not found!');
    }
  }
}