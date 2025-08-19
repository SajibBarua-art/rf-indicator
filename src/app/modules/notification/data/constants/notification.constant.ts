import { NotificationType } from '../types/notifications.types';

export const NOTIFICATION_CONSTANTS = {
  KEY: {
    RejectedByApprover: 'RejectedByApprover' as NotificationType,
    SelectedAsApprover: 'SelectedAsApprover' as NotificationType,
  },
  DEFAULT_ICON: 'heroicons_mini:user',
  PAGE_SIZE: 10,
  PAGE_NUMBER: 0,
  SCROLL_THRESHOLD: 0.8, // Load more when user scrolls to 80% of the page
} as const;
