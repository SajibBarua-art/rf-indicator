import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { TARGET_SETUP_TABLES } from '@/app/modules/target-setup/data/target-setup.constant';
import {
  DeleteTargetSetupCommandPayload,
  TargetSetupViewModel,
} from '@/app/modules/target-setup/data/target-setup.type';
import { TargetSetupCommandService } from '@/app/modules/target-setup/services/target-setup-command.service';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import {
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import {
  PlatformButtonComponent,
  PlatformConfirmationService,
} from '@platform-ui/platform-bootstrap-template';
import { Subject } from 'rxjs';
import { TARGET_SETUP_FEATURES } from '@/app/modules/target-setup/data/constants/target-setup.constant';
import { PlatformFeatureGuardModule } from '@platform-ui/platform-feature-guard';
import { TargetSetupQueryService } from '../../services/target-setup-query.service';

@Component({
  selector: 'app-target-setup-list',
  standalone: true,
  imports: [
    TranslocoModule,
    PlatformButtonComponent,
    PlatformAdvanceDatatableModule,
    PlatformFeatureGuardModule,
  ],
  templateUrl: './target-setup-list.component.html',
})
export class TargetSetupListComponent implements OnInit {
  private _router = inject(Router);
  private _platformConfirmationService = inject(PlatformConfirmationService);
  private _targetSetupCommandService = inject(TargetSetupCommandService);
  isTableVisible = true;

  private targetSetupQueryService = inject(TargetSetupQueryService);

  platformDataTable = viewChild<any>('platformDataTable');
  public initialPage$ = new Subject<number>();

  datatableConfig = signal<PlatformAdvanceDatatableOptions>({
    TableConfigId: TARGET_SETUP_TABLES.List,
  });
  public currentPageNumber: number = 0;
  protected readonly TARGET_SETUP_FEATURES = TARGET_SETUP_FEATURES;

  ngOnInit(): void {
    this.fetchTargetSetupList();
  }

  private fetchTargetSetupList(): void {
      this.targetSetupQueryService.getAll().subscribe({
        next: data => {
          console.log("target setup: ", data);
        },
        error: err => {
          console.error('Failed to fetch indicators:', err);
          // Clear the array on error
        },
      });
    }

  sideBarAction($event: {
    Action: { SidebarName: string };
    RowData: TargetSetupViewModel;
  }): void {
    console.log('$event', $event);
    if ($event?.Action?.SidebarName === 'view') {
      this.goToView($event.RowData.Id);
    }

    if ($event.Action?.SidebarName === 'delete') {
      console.log('hello');

      this._platformConfirmationService
        .open({
          title: 'Delete Confirmation',
          message: 'Are you sure you want to delete this target setup?',
          actions: {
            cancel: {
              label: 'No, Cancel',
            },
            confirm: {
              label: 'Yes, Delete',
            },
          },
        })
        .afterClosed()
        .subscribe(result => {
          if (result) {
            console.log(result);
            const payload: DeleteTargetSetupCommandPayload = {
              CorrelationId: crypto.randomUUID(),

              IndicatorId: $event.RowData.IndicatorId,

              IndicatorTargetId: $event.RowData.Id,
            };
            this._targetSetupCommandService.itemDelete(payload).subscribe({
              next: () => {
                console.log(' Status!', payload);
                this.reloadTable();
              },
              error: err => {
                console.error('Delete Error!', err);
              },
            });
          }
        });
    }
  }

  createNewEntry() {
    this._router.navigate(['target-setup', 'create']);
  }

  goToEdit(Id: string) {
    this._router.navigate(['target-setup', 'edit', Id]);
  }

  goToView(id: string) {
    this._router.navigate(['target-setup', 'view', id]);
  }

  reloadTable() {
    this.initialPage$.next(this.currentPageNumber);
  }

  refreshTable() {
    this.isTableVisible = false;

    setTimeout(() => {
      this.isTableVisible = true;
    }, 0);
  }
}
