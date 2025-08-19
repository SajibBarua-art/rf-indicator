export type NotificationType = 'RejectedByApprover' | 'SelectedAsApprover';

export type Notification = {
  id: string;
  title?: string;
  description?: string;
  icon: string;
  image?: string;
  time: string;
  read: boolean;
  link?: string;
  useRouter?: boolean;
};

export type OfflineNotification = {
  id: string;
  createdAt: string;
  isRead: boolean;
  payload: {
    responseKey: NotificationType;
    responseValue: string;
  };
};

export type OfflineNotificationApiResponse = {
  result: {
    result: {
      notifications: OfflineNotification[];
      readCount: number;
      totalCount: number;
      unreadCount: number;
    };
  };
};

export type NotificationConfig = {
  PlatformServices: {
    OfflineNotification: string;
  };
  ServiceId: string;
};
