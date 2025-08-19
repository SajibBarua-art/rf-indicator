import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-drawer-common',
  templateUrl: './drawer-common.html',
  styleUrl: './drawer-common.css',
  imports: [CommonModule, MatIconModule, MatDividerModule],
})
export class DrawerCommonComponent {
  // Set the current date
  currentDate: Date = new Date();

  @Output() closeDrawer = new EventEmitter<void>();

  onCloseDrawer() {
    this.closeDrawer.emit();
  }
}
