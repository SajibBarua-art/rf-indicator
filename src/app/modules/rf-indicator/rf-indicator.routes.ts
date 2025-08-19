import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RfIndicatorQueryService } from '@/app/modules/rf-indicator/services/rf-indicator-query.service';
import { RfIndicatorComponent } from '@/app/modules/rf-indicator/rf-indicator.component';
import { RfIndicatorListComponent } from '@/app/modules/rf-indicator/pages/list/rf-indicator-list.component';
import { RF_INDICATOR_FEATURES } from '@/app/modules/rf-indicator/data/rf-indicator.constant';
import { CreateRfIndicatorComponent } from '@/app/modules/rf-indicator/pages/create/create-rf-indicator.component';
import { FeatureAccessPermission } from '@platform-ui/platform-core/services';

export const detailsResolver: ResolveFn<unknown> = route => {
  const id = route.params['id'] || null;
  return inject(RfIndicatorQueryService).getById(id);
};

export default [
  {
    path: '',
    component: RfIndicatorComponent,
    data: { breadcrumb: 'RF Indicator' },
    children: [
      {
        path: '',
        component: RfIndicatorListComponent,
        data: {
          breadcrumb: 'RF Indicator List',
          feature: RF_INDICATOR_FEATURES.View,
        },
      },
      {
        path: 'create',
        canActivate: [FeatureAccessPermission],
        component: CreateRfIndicatorComponent,
        data: {
          breadcrumb: 'Create RF Indicator',
          feature: RF_INDICATOR_FEATURES.Create,
        },
      },
      {
        path: 'edit/:id',
        component: CreateRfIndicatorComponent,
        data: {
          isEdit: true,
          breadcrumb: 'Edit RF Indicator',
          feature: RF_INDICATOR_FEATURES.Edit,
        },
        resolve: {
          rfIndicator: detailsResolver,
        },
      },
      {
        path: 'view/:id',
        component: RfIndicatorListComponent,
        data: {
          isView: true,
          breadcrumb: 'Edit RF Indicator',
          feature: RF_INDICATOR_FEATURES.View,
        },
        resolve: {
          rfIndicator: detailsResolver,
        },
      },
    ],
  },
];
