import { ResolveFn, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { RolesComponent } from './roles.component';
import { RoleListComponent } from './pages/list/role-list.component';
import { CreateNewRoleComponent } from './pages/create/create-new-role.component';
import { RoleDetailsContainerComponent } from './pages/details/role-details-container.component';
import { RoleDetailsComponent } from './components/role-details/role-details.component';
import { RoleLogComponent } from './components/role-log/role-log.component';
import { RoleAssignListComponent } from './components/role-assign-list/role-assign-list.component';
import { RoleRecipientsComponent } from './components/role-recipients/role-recipients.component';

import { FeatureService } from './services/feature.service';
import { RoleService } from './services/role.service';
import { ROLES_CONFIG } from '@/app/modules/uam/roles/data/constants/roles.constant';
import { type Feature } from '@/app/modules/uam/roles/data/types/feature.type';
import { type Role } from '@/app/modules/uam/roles/data/types/role.type';

export const featureListResolver: ResolveFn<Feature[]> = () => {
  return inject(FeatureService).getGroupByAll();
};

export const roleDetailsResolver: ResolveFn<Role> = route => {
  const id = route.params['id'];
  return inject(RoleService).getById(id);
};

export default [
  {
    path: '',
    component: RolesComponent,
    resolve: {},
    data: { breadcrumb: ROLES_CONFIG.BREADCRUMBS.LIST },
    children: [
      {
        path: '',
        component: RoleListComponent,
      },
      {
        path: `${ROLES_CONFIG.ROUTES.DETAILS}/:id`,
        component: RoleDetailsContainerComponent,
        resolve: {
          role: roleDetailsResolver,
        },
        data: { breadcrumb: ROLES_CONFIG.BREADCRUMBS.DETAILS },
        children: [
          {
            path: '',
            redirectTo: ROLES_CONFIG.ROUTES.VIEW,
            pathMatch: 'full',
          },
          {
            path: ROLES_CONFIG.ROUTES.VIEW,
            component: RoleDetailsComponent,
          },
          {
            path: ROLES_CONFIG.ROUTES.RECIPIENTS,
            component: RoleRecipientsComponent,
          },
          {
            path: ROLES_CONFIG.ROUTES.LOG,
            component: RoleLogComponent,
          },
          {
            path: ROLES_CONFIG.ROUTES.ASSIGN,
            component: RoleAssignListComponent,
          },
        ],
      },
      {
        path: ROLES_CONFIG.ROUTES.CREATE,
        component: CreateNewRoleComponent,
        data: { breadcrumb: ROLES_CONFIG.BREADCRUMBS.CREATE },
        resolve: {
          features: featureListResolver,
        },
      },
      {
        path: `${ROLES_CONFIG.ROUTES.EDIT}/:id`,
        component: CreateNewRoleComponent,
        data: { breadcrumb: ROLES_CONFIG.BREADCRUMBS.EDIT },
        resolve: {
          features: featureListResolver,
          role: roleDetailsResolver,
        },
      },
    ],
  },
] as Routes;
