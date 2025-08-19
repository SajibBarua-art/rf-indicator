import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RfIndicatorQueryService } from '@/app/modules/rf-indicator/services/rf-indicator-query.service';
// import { RfIndicatorComponent } from '@/app/modules/rf-indicator/rf-indicator.component';
import { RfIndicatorListComponent } from '@/app/modules/rf-indicator/pages/list/rf-indicator-list.component';
import { RF_INDICATOR_FEATURES } from '@/app/modules/rf-indicator/data/rf-indicator.constant';
import { CreateRfIndicatorComponent } from '@/app/modules/rf-indicator/pages/create/create-rf-indicator.component';
import { TimelineManagementSetupComponent } from './timeline-management-setup.component';
import { TimelineSetupListComponent } from './pages/timeline-setup-list/timeline-setup-list.component';
import { CreateTimelineSetupComponent } from './pages/create-timeline-setup/create-timeline-setup.component';
import { TimelineSetupQueryService } from './services/timeline-setup-query.service';
import { FeatureAccessPermission } from '@platform-ui/platform-core/services';
import { TIMELINE_SETUP_FEATURES } from './data/timeline-setup.constant';

export const detailsResolver: ResolveFn<unknown> = route => {
  const id = route.params['id'] || null;
  return inject(TimelineSetupQueryService).getById(id);
};

export default [
  {
    path: '',
    component: TimelineManagementSetupComponent,
    data: { breadcrumb: 'Timeline Management Setup' },
    children: [
      {
        path: '',
        component: TimelineSetupListComponent,
        data: {
          breadcrumb: 'Timeline Management Setup List',
          // feature: RF_INDICATOR_FEATURES.View,
        },
      },
      {
        path: 'create',
        canActivate: [FeatureAccessPermission],
        component: CreateTimelineSetupComponent,
        data: {
          breadcrumb: 'Timeline Management Setup',
          feature: TIMELINE_SETUP_FEATURES.Create,
        },
      },
      {
        path: 'edit/:id',
        canActivate: [FeatureAccessPermission],
        component: CreateTimelineSetupComponent,
        data: {
          isEdit: true,
          breadcrumb: 'Timeline Management Setup',
          feature: TIMELINE_SETUP_FEATURES.Edit,
        },
        resolve: {
          timalineManagement: detailsResolver,
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
