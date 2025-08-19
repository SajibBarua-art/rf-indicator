import {
  Component,
  ComponentRef,
  DestroyRef,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { fuseAnimations } from '@platform-ui/platform-bootstrap-template/@fuse';
import { Router, RouterOutlet } from '@angular/router';
import { PlatformAdvanceDatatableModule } from '@platform-ui/platform-advance-datatable';
import { filter, Subject, tap } from 'rxjs';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { QuickViewComponent } from '@/app/shared/components/quick-view.component';
import { UserProfileComponent } from '@/app/modules/uam/users/components/details/user-profile/user-profile.component';
import { SuspensionProfileComponent } from '@/app/modules/uam/users/components/details/suspension-profile/suspension-profile.component';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { UserDatatableConfig } from '@/app/modules/uam/users/data/types/datatable-config.type';
import { UserActionEvent } from '@/app/modules/uam/users/data/types/user-action.type';
import {
  USER_ACTION_TYPES,
  USER_DIALOG_CONFIG,
  USER_TABLE_CONFIG_IDS,
} from '@/app/modules/uam/users/data/constants/user.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-uam-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  styleUrl: './list.component.scss',
  standalone: true,
  imports: [
    RouterOutlet,
    PlatformAdvanceDatatableModule,
    UserProfileComponent,
    PlatformButtonComponent,
    TranslocoPipe,
  ],
})
export class UserListComponent {
  private readonly vcr = viewChild('quickViewContainer', {
    read: ViewContainerRef,
  });
  private readonly contentQuickView = viewChild<TemplateRef<unknown>>(
    'contentUserDetailsProfile'
  );
  private readonly actionQuickView =
    viewChild<TemplateRef<unknown>>('contentActions');
  #componentRef?: ComponentRef<QuickViewComponent>;

  // Injected services
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // Component state
  protected readonly datatableConfig = signal<UserDatatableConfig>({
    TableConfigId: USER_TABLE_CONFIG_IDS.TABLE_USER_LIST,
  });
  protected readonly userSelected = signal<User | null>(null);
  protected readonly currentPageNumber = signal<number>(0);
  protected readonly initialPage$ = new Subject<number>();

  protected handleSideBarAction(event: UserActionEvent): void {
    const {
      Action: { SidebarName },
      RowData,
    } = event;
    if (SidebarName === USER_ACTION_TYPES.VIEW) {
      this._showDetails(RowData);
    } else if (
      SidebarName === USER_ACTION_TYPES.SUSPEND ||
      SidebarName === USER_ACTION_TYPES.UNSUSPEND
    ) {
      this._showSuspendDialog(RowData);
    }
  }

  private _showDetails(user: User) {
    this.userSelected.set(user);
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

  private _showSuspendDialog(user: User): void {
    const dialogRef = this.dialog.open<SuspensionProfileComponent>(
      SuspensionProfileComponent,
      {
        width: USER_DIALOG_CONFIG.WIDTH,
        data: user,
      }
    );

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => this.initialPage$.next(this.currentPageNumber())),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected async navigateToDetails(): Promise<void> {
    const selectedUser = this.userSelected();
    if (selectedUser?.Id) {
      await this.router.navigate(['/users/details/', selectedUser.Id]);
    }
  }
}
