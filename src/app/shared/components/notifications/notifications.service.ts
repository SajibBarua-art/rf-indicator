import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Notification, OfflineNotification } from './notifications.types';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<
    Notification[]
  >(1);

  private notificationUrl = this.config?.PlatformServices?.OfflineNotification;

  public headers = new HttpHeaders({
    'x-service-id': this.config.ServiceId,
  });

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    @Inject('config') private config: any
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for notifications
   */
  get notifications$(): Observable<Notification[]> {
    return this._notifications.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all notifications
   */
  getAll(): Observable<Notification[]> {
    return this._httpClient
      .get(`${this.notificationUrl}/OfflineNotification`)
      .pipe(
        map((response: any) =>
          this._formatNotificationsByType(
            response?.result?.result?.notifications
          )
        ),
        tap((notifications: Notification[]) => {
          this._notifications.next(notifications);
        })
      );
  }

  _formatNotificationsByType(
    offlineNotifications: OfflineNotification[]
  ): Notification[] {
    const filterTypes = ['RejectedByApprover', 'SelectedAsApprover'];
    return (
      offlineNotifications
        ?.filter(x => {
          const notificationType = x.payload.responseKey;
          return filterTypes.includes(notificationType);
        })
        ?.map(_offlineNotification => {
          const responseValue = JSON.parse(
            _offlineNotification?.payload?.responseValue || ''
          );
          const notification = {
            id: _offlineNotification.id,
            icon: 'heroicons_mini:user',
            time: _offlineNotification.createdAt,
            read: _offlineNotification.isRead,
          } as Notification;
          if (
            _offlineNotification.payload.responseKey === 'RejectedByApprover'
          ) {
            const campaign = responseValue?.Campaign;
            if (campaign) {
              const campaignName = `${campaign?.ProgramName}_${campaign?.CampaignType?.DisplayName}_${this._formatDate(campaign?.ScheduleStartTime)}`;
              notification.description = `<strong>${responseValue.RejectorName}</strong> rejected on <strong>${campaignName}</strong>`;
              notification.link = '/sms/details/' + campaign?.CampaignId;
            }

            notification.useRouter = true;
          } else if (
            _offlineNotification.payload.responseKey === 'SelectedAsApprover'
          ) {
            notification.title = `Selected as Approver on`;
            notification.description = `Sms Campaign:  <strong>${responseValue?.ProgramName}_${responseValue?.CampaignType?.DisplayName}_${this._formatDate(responseValue?.ScheduleStartTime)}</strong>`;
            notification.link = '/sms-request/details/' + responseValue.Id;
            notification.useRouter = true;
          }

          return notification;
        }) || []
    );
  }

  /**
   * Create a notification
   *
   * @param notification
   */
  create(notification: Notification): Observable<Notification> {
    return this.notifications$.pipe(
      take(1),
      switchMap(notifications =>
        this._httpClient
          .post<Notification>('api/common/notifications', {
            notification,
          })
          .pipe(
            map(newNotification => {
              // Update the notifications with the new notification
              this._notifications.next([...notifications, newNotification]);

              // Return the new notification from observable
              return newNotification;
            })
          )
      )
    );
  }

  /**
   * Update the notification
   *
   * @param id
   * @param notification
   */
  update(id: string, notification: Notification): Observable<Notification> {
    return this.notifications$.pipe(
      take(1),
      switchMap(notifications =>
        this._httpClient
          .post<Notification>(
            `${this.notificationUrl}/MarkAsRead`,
            {
              NotificationIds: [id],
            },
            { headers: this.headers }
          )
          .pipe(
            map(() => {
              // Update the notification
              notification.read = true;

              // Update the notifications
              this._notifications.next(notifications);

              // Return the updated notification
              return notification;
            })
          )
      )
    );
  }

  /**
   * Delete the notification
   *
   * @param id
   */
  delete(id: string): Observable<boolean> {
    return this.notifications$.pipe(
      take(1),
      switchMap(notifications =>
        this._httpClient
          .post<boolean>(
            `${this.notificationUrl}/MarkAsRead`,
            {
              NotificationIds: [id],
            },
            { headers: this.headers }
          )
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted notification
              const index = notifications.findIndex(item => item.id === id);

              // Delete the notification
              notifications.splice(index, 1);

              // Update the notifications
              this._notifications.next(notifications);

              // Return the deleted status
              return isDeleted;
            })
          )
      )
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<boolean> {
    return this.notifications$.pipe(
      take(1),
      switchMap(notifications =>
        this._httpClient
          .post<boolean>(
            `${this.notificationUrl}/MarkAsRead`,
            {
              NotificationIds: notifications.map(x => x.id),
            },
            { headers: this.headers }
          )
          .pipe(
            map((isUpdated: boolean) => {
              // Go through all notifications and set them as read
              notifications.forEach((notification, index) => {
                notifications[index].read = true;
              });

              // Update the notifications
              this._notifications.next(notifications);

              // Return the updated status
              return isUpdated;
            })
          )
      )
    );
  }

  private _formatDate(dateString: string): string {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
