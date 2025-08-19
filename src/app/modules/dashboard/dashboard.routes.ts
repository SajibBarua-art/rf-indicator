import { ResolveFn, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const dashboardResolver: ResolveFn<any> = route => {
  const id = route.params['id'];

  // return inject(SmsTemplateService).getById(id);
};

export default [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      dashboard: dashboardResolver,
    },
    data: { breadcrumb: 'Dashboard' },
  },
] as Routes;
