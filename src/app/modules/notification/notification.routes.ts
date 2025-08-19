import { Routes } from '@angular/router';
import { NotificationComponent } from './pages/notification.component';

export default [
  {
    path: '',
    component: NotificationComponent,
    data: { breadcrumb: 'Notification' },
    resolve: {},
  },
] as Routes;
