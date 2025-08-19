import { User } from './user.type';
import { USER_ACTION_TYPES } from '@/app/modules/uam/users/data/constants/user.constants';

export type UserAction = {
  SidebarName: (typeof USER_ACTION_TYPES)[keyof typeof USER_ACTION_TYPES];
};

export type UserActionEvent = {
  Action: UserAction;
  RowData: User;
};
