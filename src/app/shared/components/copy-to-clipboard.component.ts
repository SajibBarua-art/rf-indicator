import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copy-to-clipboard',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, CommonModule],
  template: `<mat-icon
    [class]="iconClass"
    (click)="copyToClipboard()"
    [svgIcon]="svgIcon"
    [matTooltip]="tooltipText"
    matTooltipPosition="above"
    aria-label="Copy to Clipboard">
    content_copy
  </mat-icon> `,
})
export class CopyToClipboardComponent {
  @Input() text: string = '';
  @Input() iconClass: string = 'cursor-pointer';
  @Input() svgIcon: string = 'platform_solid:copy';
  @Input() tooltipText: string = 'Copy to Clipboard';

  copyToClipboard() {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = this.text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert(`Copied to clipboard: ${this.text}`);
  }
}
