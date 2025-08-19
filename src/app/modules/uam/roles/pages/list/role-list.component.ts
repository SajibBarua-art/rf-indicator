import {
  Component,
  ComponentRef,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  NgxDatatableModule,
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { Subject } from 'rxjs';
import { Role } from '@/app/modules/uam/roles/data/types/role.type';
import { TranslocoDirective } from '@ngneat/transloco';
import { QuickViewComponent } from '@/app/shared/components/quick-view.component';
import { RoleDetailsComponent } from '@/app/modules/uam/roles/components/role-details/role-details.component';
import { RoleService } from '@/app/modules/uam/roles/services/role.service';
import { PlatformFeatureGuardModule } from '@platform-ui/platform-feature-guard';
import { ROLE_FEATURES } from '../../data/constants/roles.constant';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    NgxDatatableModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    FormsModule,
    PlatformAdvanceDatatableModule,
    PlatformButtonComponent,
    TranslocoDirective,
    RoleDetailsComponent,
    PlatformFeatureGuardModule,
  ],
})
export class RoleListComponent {
  // Injected services
  private router = inject(Router);
  public dialog = inject(MatDialog);
  public roleService = inject(RoleService);

  public initialPage$: Subject<number> = new Subject<number>();

  // Local state
  datatableConfigOptions = signal<PlatformAdvanceDatatableOptions>({
    TableConfigId: 'role-list-table',
  });
  rows: Role[] = [];
  roleSelected: Role;

  protected readonly ROLE_FEATURES = ROLE_FEATURES;
  private readonly vcr = viewChild('quickViewContainer', {
    read: ViewContainerRef,
  });
  private readonly contentQuickView = viewChild<TemplateRef<unknown>>(
    'contentRoleDetailsProfile'
  );
  private readonly actionQuickView =
    viewChild<TemplateRef<unknown>>('contentActions');
  #componentRef?: ComponentRef<QuickViewComponent>;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  gotoCreate() {
    this.router.navigate(['roles/create']).then();
  }

  sideBarAction($event: {
    Action: { SidebarName: string };
    RowData: Role;
  }): void {
    if ($event?.Action?.SidebarName === 'view') {
      this._showDetails($event.RowData);
    }
  }

  private _showDetails(role: Role) {
    this.roleSelected = role;
    this.vcr()?.clear();
    const contentView = this.vcr()?.createEmbeddedView(this.contentQuickView());
    const actionView = this.vcr()?.createEmbeddedView(this.actionQuickView());
    this.#componentRef = this.vcr().createComponent(QuickViewComponent, {
      projectableNodes: [contentView?.rootNodes, actionView?.rootNodes],
    });
    this.#componentRef.instance.openPanel();
    this.#componentRef.instance.closed.subscribe(() => {
      this.#componentRef?.destroy();
    });
  }
}
