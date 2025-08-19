import { Route } from '@angular/router';
import {
  FeatureAccessPermission,
  PlatformAuthGuard,
} from '@platform-ui/platform-core/services';
import { LayoutComponent } from '@/app/layout/layout.component';
import { EmptyLayoutComponent } from '@/app/layout/empty/empty.component';

export const DEFAULT_ROUTE = 'dashboard';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_ROUTE },

  // maintenance mode
  {
    path: 'maintenance',
    pathMatch: 'full',
    loadChildren: () =>
      import('@/app/shared/components/maintenance/maintenance.routes'),
  },

  // no permission
  {
    path: 'error',
    pathMatch: 'full',
    component: EmptyLayoutComponent,
    loadChildren: () =>
      import('@/app/shared/components/error-500/error-500.routes'),
  },

  // no permission
  {
    path: 'access-denied',
    pathMatch: 'full',
    component: EmptyLayoutComponent,
    loadChildren: () =>
      import('@/app/shared/components/access-denied/access-denied.routes'),
  },

  // Admin routes
  {
    path: '',
    canActivate: [PlatformAuthGuard],
    canActivateChild: [PlatformAuthGuard],
    component: LayoutComponent,
    resolve: {},
    children: [
      // Dashboards
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.routes'),
        canActivate: [],
      },

      // UAM
      {
        path: 'users',
        loadChildren: () => import('./modules/uam/users/users.routes'),
        canActivate: [FeatureAccessPermission],
        data: {
          feature: 'can_view_user_list',
        },
      },

      // profile
      {
        path: 'profile',
        loadChildren: () => import('./modules/uam/profile/profile.routes'),
        canActivate: [],
        data: {
          name: 'profile.manage',
        },
      },

      // Roles
      {
        path: 'roles',
        loadChildren: () => import('./modules/uam/roles/roles.routes'),
        canActivate: [FeatureAccessPermission],
        data: {
          feature: 'can_view_role_list',
        },
      },

      //notification
      {
        path: 'notification',
        loadChildren: () =>
          import('./modules/notification/notification.routes'),
        canActivate: [],
        data: {
          name: 'notification.manage',
        },
      },

      // RF Indicator List
      {
        path: 'rf-indicator',
        loadChildren: () =>
          import('./modules/rf-indicator/rf-indicator.routes'),
      },

      // Target Setup
      {
        path: 'target-setup',
        loadChildren: () =>
          import('./modules/target-setup/target-setup.routes'),
      },

      //indicator breakdown configuration
      {
        path: 'indicator_breakdown_configuration',
        loadChildren: () =>
          import('./modules/indicator-breakdown/indicator-breakdown.routes'),
      },

      // target setup
      {
        path: 'target-setup',
        loadChildren: () =>
          import('./modules/target-setup/target-setup.routes'),
      },
      {
        path: 'timeline-management',
        loadChildren: () =>
          import(
            './modules/timeline-management-setup/timeline-management-setup.routes'
          ),
      },

      //

      // release note
      {
        path: 'release-note',
        pathMatch: 'full',
        loadChildren: () =>
          import('@/app/shared/components/release-note/release-note.routes'),
      },

      // 404 & Catch all
      {
        path: '404-not-found',
        pathMatch: 'full',
        loadChildren: () =>
          import('@/app/shared/components/error-404/error-404.routes'),
      },

      { path: '**', redirectTo: '404-not-found' },
    ],
  },
];
