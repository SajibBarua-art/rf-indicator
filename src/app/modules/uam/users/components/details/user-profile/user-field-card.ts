import { Component, Input } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile-field-card',
  imports: [TranslocoDirective, MatIcon],
  template: `
    <div
      class="bg-white border box-content px-[24px] py-[16px] rounded-lg flex flex-grow justify-start items-center"
      *transloco="let t">
      <!-- icon -->
      @if (icon) {
        <div class="flex items-center rounded-full">
          <mat-icon class="w-[50px] h-[50px]" [svgIcon]="icon"></mat-icon>
        </div>
      }
      <!-- content -->
      <div class="flex flex-col gap-[8px] min-h-[48px]">
        <div class="text-sm">
          <ng-content select="[userCardTitle]"></ng-content>
        </div>
        <div class="flex text-gray-800 font-bold text-md min-h-8">
          <ng-content select="[userCardBody]"></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ProfileFieldCardComponent {
  @Input() icon: string;
  @Input() title: string = '';
  @Input() value: string | number = '';
}
