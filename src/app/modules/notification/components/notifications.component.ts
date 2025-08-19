import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';
import { TranslocoDirective } from '@ngneat/transloco';
import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../data/types/notifications.types';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'notifications',
  standalone: true,
  imports: [
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatTooltipModule,
    NgFor,
    NgClass,
    NgTemplateOutlet,
    DatePipe,
    MatDivider,
    TranslocoDirective,
  ],
})
export class NotificationsComponent {
  readonly isListMode = input<boolean>(false);
  readonly isLoading = input<boolean>(false);

  @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
  @ViewChild('notificationsPanel')
  private _notificationsPanel: TemplateRef<any>;

  private readonly _overlay = inject(Overlay);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _router = inject(Router);
  private readonly _notificationsService = inject(NotificationsService);
  private readonly _destroyRef = inject(DestroyRef);

  private _overlayRef: OverlayRef;

  readonly notifications = this._notificationsService.notifications;
  readonly unreadCount = this._notificationsService.unreadCount;
  readonly loading = this._notificationsService.loading;

  constructor() {
    // Only load notifications in dropdown mode, not in list mode
    // List mode will be handled by the parent component
    if (!this.isListMode()) {
      this._notificationsService
        .refresh()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe();
    }
  }

  openPanel(): void {
    if (!this._notificationsPanel || !this._notificationsOrigin) {
      return;
    }

    if (!this._overlayRef) {
      this._createOverlay();
    }

    this._overlayRef.attach(
      new TemplatePortal(this._notificationsPanel, this._viewContainerRef)
    );
  }

  closePanel(): void {
    this._overlayRef?.detach();
  }

  markAllAsRead(): void {
    this._notificationsService.markAllAsRead().subscribe();
  }

  toggleRead(notification: Notification): void {
    this._notificationsService
      .update(notification.id, notification)
      .subscribe();
  }

  delete(notification: Notification): void {
    this._notificationsService.delete(notification.id).subscribe();
  }

  gotoList(): void {
    this.closePanel();
    this._router.navigate(['/notification']);
  }

  gotoNotificationDetails(notification: Notification): void {
    if (notification.useRouter && notification.link) {
      this.closePanel();
      this._router.navigate([notification.link]);
    }
  }

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }

  private _createOverlay(): void {
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      backdropClass: 'fuse-backdrop-on-mobile',
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(
          this._notificationsOrigin._elementRef.nativeElement
        )
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
          },
        ]),
    });

    this._overlayRef.backdropClick().subscribe(() => {
      this._overlayRef.detach();
    });
  }
}
