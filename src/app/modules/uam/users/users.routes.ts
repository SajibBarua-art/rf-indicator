import { ResolveFn, Routes } from '@angular/router';

import { inject } from '@angular/core';
import { UserListComponent } from './pages/list/list.component';
import { UsersComponent } from './users.component';
import { CreateUserComponent } from './pages/create/create.component';
import { UserDetailsComponent } from './pages/details/user-details.component';
import { UserService } from './user.service';
import { UserDataService } from '@platform-ui/platform-core/services';
import { SuspensionHistoryComponent } from '@/app/modules/uam/users/components/details/suspense-history/suspension-history.component';
import { UserDetailsProfileComponent } from '@/app/modules/uam/users/pages/details/profile/user-details-profile.component';

export const uamDetailsResolver: ResolveFn<unknown> = route => {
  const id = route.params['id'];

  return inject(UserService).getById(id);
};

export const profileDetailsResolver: ResolveFn<unknown> = route => {
  let id = route.params['id'];
  if (!id) {
    id = inject(UserDataService).getUserData()?.UserId;
  }

  return inject(UserService).getById(id);
};

export default [
  {
    path: '',
    component: UsersComponent,
    resolve: {},
    data: { breadcrumb: 'User Management' },
    children: [
      {
        path: '',
        component: UserListComponent,
        resolve: {},
        data: { breadcrumb: 'User List' },
      },
      {
        path: 'details/:id',
        component: UserDetailsComponent,
        resolve: {
          user: profileDetailsResolver,
        },
        data: { breadcrumb: 'User Details' },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'profile',
            component: UserDetailsProfileComponent,
            resolve: {},
            data: {},
          },
          {
            path: 'log',
            component: SuspensionHistoryComponent,
            resolve: {},
            data: {},
          },
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
            resolve: {},
            data: {},
          },
        ],
      },
      {
        path: 'create',
        component: CreateUserComponent,
        resolve: {},
      },
      {
        path: 'edit/:id',
        component: CreateUserComponent,
        resolve: {
          data: uamDetailsResolver,
        },
      },
    ],
  },
] as Routes;
