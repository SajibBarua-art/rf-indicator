import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, computed, signal } from '@angular/core';
import {
  Notification,
  NotificationConfig,
  OfflineNotification,
  OfflineNotificationApiResponse,
} from '../data/types/notifications.types';
import { map, Observable, of, tap } from 'rxjs';
import { NOTIFICATION_CONSTANTS } from '../data/constants/notification.constant';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _hasMoreNotifications = signal<boolean>(true);
  readonly hasMoreNotifications = this._hasMoreNotifications.asReadonly();

  private readonly _currentPage = signal<number>(0);
  readonly currentPage = this._currentPage.asReadonly();

  readonly unreadCount = signal(0);

  private readonly notificationUrl =
    this.config?.PlatformServices?.OfflineNotification;
  private readonly headers = new HttpHeaders({
    'x-service-id': this.config.ServiceId,
  });

  constructor(
    private readonly _httpClient: HttpClient,
    @Inject('config') private readonly config: NotificationConfig
  ) {}

  getAll(reset: boolean = false): Observable<Notification[]> {
    if (reset) {
      this._notifications.set([]);
      this._currentPage.set(0);
      this._hasMoreNotifications.set(true);
    }

    if (!this._hasMoreNotifications() || this._loading()) {
      return new Observable(observer => {
        observer.next(this._notifications());
        observer.complete();
      });
    }

    this._loading.set(true);

    const queryParams = Object.values(NOTIFICATION_CONSTANTS.KEY)
      .map(key => `ResponseKeys=${key}`)
      .join('&');

    return this._httpClient
      .get<OfflineNotificationApiResponse>(
        `${this.notificationUrl}/OfflineNotification?PageNumber=${this._currentPage()}&PageSize=${NOTIFICATION_CONSTANTS.PAGE_SIZE}&${queryParams}`
      )
      .pipe(
        map(response => {
          const newNotifications = this._formatNotificationsByType(
            response?.result?.result?.notifications
          );
          this.unreadCount.set(response?.result?.result?.unreadCount);

          // Check if we've reached the end of the list
          if (newNotifications.length < NOTIFICATION_CONSTANTS.PAGE_SIZE) {
            this._hasMoreNotifications.set(false);
          }

          return newNotifications;
        }),
        tap(newNotifications => {
          // Increment the page for the next request
          this._currentPage.update(page => page + 1);

          // Append new notifications to the existing list
          if (reset) {
            this._notifications.set(newNotifications);
          } else {
            this._notifications.update(notifications => [
              ...notifications,
              ...newNotifications,
            ]);
          }

          this._loading.set(false);
        })
      );
  }

  loadMore(): Observable<Notification[]> {
    return this.getAll(false);
  }

  refresh(): Observable<Notification[]> {
    return this.getAll(true);
  }

  private _formatNotificationsByType(
    offlineNotifications: OfflineNotification[]
  ): Notification[] {
    const filterTypes = Object.values(NOTIFICATION_CONSTANTS.KEY);

    return (
      offlineNotifications
        ?.filter(x => filterTypes.includes(x.payload.responseKey))
        ?.map(offlineNotification => {
          const responseValue = JSON.parse(
            offlineNotification?.payload?.responseValue || ''
          );
          const notification: Notification = {
            id: offlineNotification.id,
            icon: NOTIFICATION_CONSTANTS.DEFAULT_ICON,
            time: offlineNotification.createdAt,
            read: offlineNotification.isRead,
          };

          if (
            offlineNotification.payload.responseKey ===
            NOTIFICATION_CONSTANTS.KEY.RejectedByApprover
          ) {
            const campaign = responseValue?.Campaign;
            if (campaign) {
              const campaignName = `${campaign?.ProgramName}_${campaign?.CampaignType?.DisplayName}_${this._formatDate(campaign?.ScheduleStartTime)}`;
              notification.description = `<strong>${responseValue.RejectorName}</strong> rejected on <strong>${campaignName}</strong>`;
              notification.link = '/sms/details/' + campaign?.CampaignId;
              notification.useRouter = true;
            }
          } else if (
            offlineNotification.payload.responseKey ===
            NOTIFICATION_CONSTANTS.KEY.SelectedAsApprover
          ) {
            notification.title = 'Selected as Approver on';
            notification.description = `Sms Campaign: <strong>${responseValue?.ProgramName}_${responseValue?.CampaignType?.DisplayName}_${this._formatDate(responseValue?.ScheduleStartTime)}</strong>`;
            notification.link = '/sms-request/details/' + responseValue.Id;
            notification.useRouter = true;
          }

          return notification;
        }) || []
    );
  }

  update(id: string, notification: Notification): Observable<Notification> {
    return this._httpClient
      .post<Notification>(
        `${this.notificationUrl}/MarkAsRead`,
        { NotificationIds: [id] },
        { headers: this.headers }
      )
      .pipe(
        map(() => {
          const notifications = this._notifications().map(n =>
            n.id === id ? { ...n, read: true } : n
          );
          this._notifications.set(notifications);
          return { ...notification, read: true };
        })
      );
  }

  delete(id: string): Observable<boolean> {
    return this._httpClient
      .post<boolean>(
        `${this.notificationUrl}/MarkAsRead`,
        { NotificationIds: [id] },
        { headers: this.headers }
      )
      .pipe(
        map(() => {
          const notifications = this._notifications().filter(n => n.id !== id);
          this._notifications.set(notifications);
          return true;
        })
      );
  }

  markAllAsRead(): Observable<boolean> {
    const notificationIds = this._notifications()
      ?.filter(x => !x.read)
      .map(n => n.id);

    if (notificationIds?.length === 0) return of(true);

    return this._httpClient
      .post<boolean>(
        `${this.notificationUrl}/MarkAsRead`,
        { NotificationIds: notificationIds },
        { headers: this.headers }
      )
      .pipe(
        map(() => {
          const notifications = this._notifications().map(n => ({
            ...n,
            read: true,
          }));
          this._notifications.set(notifications);
          return true;
        })
      );
  }

  private _formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
