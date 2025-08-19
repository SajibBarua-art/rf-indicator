import { Component, inject, signal, ViewChild } from '@angular/core';

import {
  DatatableComponent,
  NgxDatatableModule,
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Role } from '@/app/modules/uam/roles/data/types/role.type';

@Component({
  selector: 'app-role-log',
  templateUrl: './role-log.component.html',
  styleUrl: './role-log.component.css',
  imports: [NgxDatatableModule, MatIconModule, PlatformAdvanceDatatableModule],
})
export class RoleLogComponent {
  public _dialog = inject(MatDialog);
  @ViewChild(DatatableComponent) table: DatatableComponent;

  datatableOptions = signal<PlatformAdvanceDatatableOptions>(null);
  role: Role;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.role = this.route.parent.snapshot.data['role'];

    this.datatableOptions.set({
      TableConfigId: 'role-log-list-table',
      CustomFilterQuery: `{RoleId: GUID('${this.role.Id}')}`,
    });
  }
}
