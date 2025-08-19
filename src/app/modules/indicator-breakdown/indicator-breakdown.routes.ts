import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RfIndicatorQueryService } from '@/app/modules/rf-indicator/services/rf-indicator-query.service';
import { RfIndicatorListComponent } from '@/app/modules/rf-indicator/pages/list/rf-indicator-list.component';
import { RF_INDICATOR_FEATURES } from '@/app/modules/rf-indicator/data/rf-indicator.constant';
import { CreateRfIndicatorComponent } from '@/app/modules/rf-indicator/pages/create/create-rf-indicator.component';
import { IndicatorBreakdownListComponent } from './pages/indicator-breakdown-list/indicator-breakdown-list.component';
import { IndicatorBreakdownComponent } from './indicator-breakdown.component';
import { IndicatorBreakdownEditComponent } from './pages/indicator-breakdown-edit/indicator-breakdown-edit.component';
import { IndicatorBreakdownService } from './service/indicator-breakdown.query.service';
import { INDICATOR_BREAKDOWN_FEATURE } from './data/indicator-breakdown.constant';
import { FeatureAccessPermission } from '@platform-ui/platform-core/services';

export const detailsResolver: ResolveFn<unknown> = route => {
  const id = route.params['id'] || null;
  return inject(RfIndicatorQueryService).getById(id);
};
export const breakDownResolver: ResolveFn<unknown> = route => {
  const id = route.params['id'] || null;
  return inject(IndicatorBreakdownService).getConfigurationIndicatorById(id);
};

export default [
  {
    path: '',
    component: IndicatorBreakdownComponent,
    data: { breadcrumb: 'Indicator Breakdown' },
    children: [
      {
        path: '',
        component: IndicatorBreakdownListComponent,
        data: {
          breadcrumb: 'Indicator Breakdown List',
          feature: RF_INDICATOR_FEATURES.View,
        },
      },
      {
        path: 'create',
        component: CreateRfIndicatorComponent,
        data: {
          breadcrumb: 'Create RF Indicator',
          feature: RF_INDICATOR_FEATURES.Create,
        },
      },
      {
        path: 'edit/:id',
        canActivate: [FeatureAccessPermission],
        component: IndicatorBreakdownEditComponent,
        data: {
          isEdit: true,
          breadcrumb: 'Indicator With Breakdown Configuration',

          feature: INDICATOR_BREAKDOWN_FEATURE.Edit,
        },
        resolve: {
          rfIndicator: detailsResolver,
          rfBreakdOwnIndicator: breakDownResolver,
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
