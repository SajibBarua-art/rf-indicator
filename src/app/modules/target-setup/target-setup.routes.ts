import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TargetSetupQueryService } from '@/app/modules/target-setup/services/target-setup-query.service';
import { TargetSetupComponent } from './target-setup.component';
import { TargetSetupListComponent } from './pages/list/target-setup-list.component';
import { TARGET_SETUP_FEATURES } from '@/app/modules/target-setup/data/constants/target-setup.constant';
import { CreateTargetSetupComponent } from './pages/create/create-target-setup.component';
import { RfIndicatorListComponent } from '../rf-indicator/pages/list/rf-indicator-list.component';
import { FeatureAccessPermission } from '@platform-ui/platform-core/services';

export const detailsResolver: ResolveFn<unknown> = route => {
  const id = route.params['id'] || null;
  return inject(TargetSetupQueryService).getById(id);
};

export default [
  {
    path: '',
    component: TargetSetupComponent,
    data: { breadcrumb: 'Target Setup' },
    children: [
      {
        path: '',
        component: TargetSetupListComponent,
        data: {
          breadcrumb: 'Target Setup List',
          feature: TARGET_SETUP_FEATURES.View,
        },
      },
      {
        path: 'create',
        component: CreateTargetSetupComponent,
        data: {
          breadcrumb: 'Create Target Setup',
          feature: TARGET_SETUP_FEATURES.Create,
        },
      },
      {
        path: 'edit/:id',
        component: CreateTargetSetupComponent,
        data: {
          isEdit: true,
          breadcrumb: 'Edit Target Setup',
          feature: TARGET_SETUP_FEATURES.Edit,
        },
        resolve: {
          targetSetup: detailsResolver,
        },
      },
      {
        path: 'view/:id',
        component: TargetSetupListComponent,
        data: {
          isView: true,
          breadcrumb: 'View Target Setup',
          feature: TARGET_SETUP_FEATURES.View,
        },
        resolve: {
          targetSetup: detailsResolver,
        },
      },
    ],
  },
];
