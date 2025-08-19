import {
  Component,
  HostBinding,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { FuseDrawerComponent } from '@platform-ui/platform-bootstrap-template';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-quick-view',
  template: `
    <fuse-drawer
      class="w-screen max-w-screen md:w-[466px] md:max-w-[466px] lg:w-[466px] lg:max-w-[466px] z-999"
      fixed
      [mode]="'over'"
      [name]="'detailsDrawer'"
      [position]="'right'"
      #detailsDrawer>
      <!-- drawer header  -->
      <div class="w-full overflow-auto bg-card">
        <div class="flex flex-row items-center px-9 py-7" *transloco="let t">
          <div class="text-xl font-bold tracking-tight">{{ t(title()) }}</div>
          <button class="ml-auto" mat-icon-button (click)="closePanel()">
            <mat-icon
              class="text-current"
              [svgIcon]="'platform_solid:close'"></mat-icon>
          </button>
        </div>
        <mat-divider></mat-divider>
        <!-- sms details  -->
        <div class="px-9">
          <ng-content select="[quickViewContent]"></ng-content>
        </div>
        <!-- footer  -->
        <div class="fixed bottom-0 w-full">
          <div
            class="bg-white px-9 mt-4 flex flex-row gap-8 justify-center w-full font-semibold py-6">
            <ng-content select="[quickViewActions]"></ng-content>
          </div>
        </div>
      </div>
    </fuse-drawer>
  `,
  imports: [
    FuseDrawerComponent,
    MatDivider,
    MatIcon,
    TranslocoModule,
    MatIconButton,
  ],
})
export class QuickViewComponent {
  @HostBinding('attr.hostID') hostID = crypto.randomUUID();
  @ViewChild('detailsDrawer', { static: true })
  detailsDrawer: FuseDrawerComponent;

  title = input<string>('Details');
  closed = output<void>();

  openPanel() {
    this.detailsDrawer.open();
  }

  closePanel() {
    this.detailsDrawer.close();
    this.closed.emit();
  }
}
