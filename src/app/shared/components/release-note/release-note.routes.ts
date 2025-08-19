import { Routes } from '@angular/router';
import { ReleaseNoteComponent } from './release-note.component';

export default [
  {
    path: '',
    component: ReleaseNoteComponent,
    data: {
      breadcrumb: 'Release Note',
    },
  },
] as Routes;
