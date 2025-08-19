export const USER_ACTION_TYPES = {
  VIEW: 'view',
  SUSPEND: 'suspend',
  UNSUSPEND: 'unsuspend',
} as const;

export const USER_DIALOG_CONFIG = {
  WIDTH: '30vw',
} as const;

export const USER_COMMAND_TYPES = {
  CREATE: 'Platform.Uam.Commands.CreateUserCommand',
  UPDATE: 'Platform.Uam.Commands.UpdateUserCommand',
  ACTIVATE: 'Platform.Uam.Commands.ActivateUserCommand',
  SUSPEND: 'Platform.Uam.Commands.SuspendUserCommand',
} as const;

export const USER_TABLE_CONFIG_IDS = {
  TABLE_USER_SUSPENSION_HISTORY_LIST: 'user-suspension-history-list',
  TABLE_USER_LIST: 'table-user-list',
} as const;

export const USER_FEATURES = {
  View: 'can_view_user_list',
  Details: 'can_view_user_details',
  Suspend: 'can_suspend_unsuspend_user',
};
