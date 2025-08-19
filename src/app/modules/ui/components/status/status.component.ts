import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
  imports: [CommonModule],
})
export class StatusComponent {
  @Input() status: string;
}
