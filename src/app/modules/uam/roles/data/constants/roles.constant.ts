export const ROLES_CONFIG = {
  COMMAND_TYPES: {
    CREATE: 'Platform.Uam.Commands.CreateRoleCommand',
    UPDATE: 'Platform.Uam.Commands.UpdateRoleCommand',
  },
  QUERY_TEMPLATES: {
    Role: 'RoleQuery',
    Feature: 'FeatureQuery',
  },
  PAGE_SIZE: 10,
  DEFAULT_SORT: 'CreatedBy',
  DEFAULT_SORT_DIRECTION: 'desc',
  BREADCRUMBS: {
    LIST: 'Role List',
    CREATE: 'Create Role',
    EDIT: 'Edit Role',
    DETAILS: 'Role Details',
  },
  ROUTES: {
    LIST: '',
    CREATE: 'create',
    EDIT: 'edit',
    DETAILS: 'details',
    VIEW: 'view',
    RECIPIENTS: 'recipients',
    LOG: 'log',
    ASSIGN: 'assign',
  },
} as const;

export const ROLE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED',
} as const;

export const ROLE_FEATURES = {
  View: 'can_view_role_list',
  Create: 'can_create_role',
  Edit: 'can_edit_role',
  Assign: 'can_assign_user_to_role',
};

export const ROLE_NOTIFICATIONS = {
  Create: 'RoleCreatedSuccessfully',
  Update: 'RoleUpdatedSuccessfully',
};

export type RoleStatus = (typeof ROLE_STATUS)[keyof typeof ROLE_STATUS];
