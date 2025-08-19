import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsComponent } from '../components/notifications.component';
import { NotificationsService } from '../services/notifications.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NOTIFICATION_CONSTANTS } from '../data/constants/notification.constant';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  imports: [
    MatDividerModule,
    MatIconModule,
    NotificationsComponent,
    NgIf,
    MatProgressSpinnerModule,
    TranslocoPipe,
    MatIconButton,
    MatTooltip,
  ],
})
export class NotificationComponent {
  private readonly _dialog = inject(MatDialog);
  private readonly _notificationsService = inject(NotificationsService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly notifications = this._notificationsService.notifications;
  readonly unreadCount = this._notificationsService.unreadCount;
  readonly loading = this._notificationsService.loading;
  readonly hasMoreNotifications =
    this._notificationsService.hasMoreNotifications;

  constructor() {
    this._notificationsService
      .refresh()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.shouldLoadMore()) {
      this.loadMore();
    }
  }

  loadMore(): void {
    this._notificationsService
      .loadMore()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  refresh(): void {
    this._notificationsService
      .refresh()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  private shouldLoadMore(): boolean {
    if (!this.hasMoreNotifications() || this.loading()) {
      return false;
    }

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more when user scrolls to the threshold percentage of the page
    return (
      scrollPosition + windowHeight >
      documentHeight * NOTIFICATION_CONSTANTS.SCROLL_THRESHOLD
    );
  }
}
