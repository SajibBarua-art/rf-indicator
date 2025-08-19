import { Component, inject, signal } from '@angular/core';
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
import { RFIndicatorViewModel } from '@/app/modules/rf-indicator/data/rf-indicator.type';
import {
  RF_INDICATOR_FEATURES,
  RF_INDICATOR_TABLES,
} from '@/app/modules/rf-indicator/data/rf-indicator.constant';
import { RfIndicatorCommandService } from '../../services/rf-indicator-command.services';
import { PlatformFeatureGuardModule } from '@platform-ui/platform-feature-guard';

interface RFIndicatorWithStatus extends RFIndicatorViewModel {
  Status?: {
    Value: number;
    DisplayName: string;
  };
}

@Component({
  selector: 'app-rf-indicator-list',
  standalone: true,
  imports: [
    TranslocoModule,
    PlatformButtonComponent,
    PlatformAdvanceDatatableModule,
    PlatformFeatureGuardModule,
  ],
  templateUrl: './rf-indicator-list.component.html',
})
export class RfIndicatorListComponent {
  private _router = inject(Router);
  public initialPage$ = new Subject<number>();
  private _platformConfirmationService = inject(PlatformConfirmationService);
  private _rfIndicatorCommandService = inject(RfIndicatorCommandService);
  RF_INDICATOR_FEATURES = RF_INDICATOR_FEATURES;
  isTableVisible = true;

  datatableConfig = signal<PlatformAdvanceDatatableOptions>({
    TableConfigId: RF_INDICATOR_TABLES.List,
  });
  public currentPageNumber: number = 0;

  sideBarAction($event: {
    Action: { SidebarName: string };
    RowData: RFIndicatorWithStatus;
  }): void {
    console.log('$event', $event);
    if (
      $event?.Action?.SidebarName === 'activate-status' ||
      $event?.Action?.SidebarName === 'deactivate-status'
    ) {
      const statusDisplayName =
        $event.RowData.Status?.DisplayName?.toLowerCase();

      const StatusId = statusDisplayName === 'active' ? 0 : 1;
      const payload = {
        CorrelationId: crypto.randomUUID(),
        IndicatorId: $event.RowData.Id,
        StatusId: StatusId,
      };
      this._platformConfirmationService
        .open({
          title: 'Status Update',
          message: 'Are you sure you want to change this status?',
          actions: {
            cancel: {
              label: 'No',
            },
            confirm: {
              label: 'Yes, Update',
            },
          },
        })
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this._rfIndicatorCommandService.statusUpdate(payload).subscribe({
              next: response => {
                console.log('response', response);

                this.reloadCurrentPage();
              },
              error: err => {
                console.error('Status update failed', err);
              },
            });
          }
        });
    }
  }

  createNewEntry() {
    this._router.navigate(['rf-indicator', 'create']);
  }

  reloadCurrentPage() {
    this.initialPage$.next(this.currentPageNumber);
  }

  refreshTable() {
    this.isTableVisible = false;

    setTimeout(() => {
      this.isTableVisible = true;
    }, 0);
  }
}
