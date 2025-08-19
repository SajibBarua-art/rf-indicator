export interface Notification {
  id: string;
  icon?: string;
  image?: string;
  title?: string;
  description?: string;
  time: string;
  link?: string;
  useRouter?: boolean;
  read: boolean;
}

export type OfflineNotification = {
  id: string;
  referenceId: string;
  createdBy: string;
  isRead: boolean;
  denormalizedPayload: string;
  createdAt: string;
  payload: {
    subscriptionFilters: string;
    notificationType: string;
    responseKey: string;
    responseValue: string;
  };
};
