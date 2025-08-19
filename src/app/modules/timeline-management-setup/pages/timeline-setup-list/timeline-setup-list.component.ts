import { Component, inject, signal } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';
import {
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import {
  PlatformButtonComponent,
  PlatformConfirmationService,
} from '@platform-ui/platform-bootstrap-template';
import { Subject } from 'rxjs';
import {
  TIMELINE_SETUP_FEATURES,
  TIMELINE_SETUP_TABLES,
} from '../../data/timeline-setup.constant';
import { TimelineSetupViewModel } from '../../data/timeline-setup.type';
import { TimelineSetupCommandService } from '../../services/timeline-setup-command.service';
import { PlatformFeatureGuardModule } from '@platform-ui/platform-feature-guard';
interface TimelineSetupWithStatus extends TimelineSetupViewModel {
  Status?: {
    Value: number;
    DisplayName: string;
  };
}

@Component({
  selector: 'app-timeline-setup-list',
  standalone: true,
  imports: [
    TranslocoModule,
    PlatformButtonComponent,
    PlatformAdvanceDatatableModule,
    PlatformFeatureGuardModule,
  ],
  templateUrl: './timeline-setup-list.component.html',
})
export class TimelineSetupListComponent {
  private _router = inject(Router);
  public initialPage$ = new Subject<number>();
  private _platformConfirmationService = inject(PlatformConfirmationService);
  private timelineSetupCommandService = inject(TimelineSetupCommandService);
  isTableVisible = true;
  datatableConfig = signal<PlatformAdvanceDatatableOptions>({
    TableConfigId: TIMELINE_SETUP_TABLES.List,
  });
  public currentPageNumber: number = 0;
  TIMELINE_SETUP_FEATURES = TIMELINE_SETUP_FEATURES;
  sideBarAction($event: {
    Action: { SidebarName: string };
    RowData: TimelineSetupWithStatus;
  }): void {
    console.log('$event', $event);
    if ($event?.Action?.SidebarName === 'edit') {
      this.goToView($event.RowData.Id);
    }

    if ($event?.Action?.SidebarName === 'delete') {
      const statusDisplayName =
        $event.RowData.Status?.DisplayName?.toLowerCase();

      const StatusId = statusDisplayName === 'active' ? 0 : 1;
      const payload = {
        CorrelationId: crypto.randomUUID(),
        IndicatorId: $event.RowData.Id,
        statusId: StatusId,
      };
      this._platformConfirmationService
        .open({
          title: 'Delete',
          message: 'Are you sure you want to delete this status?',
          actions: {
            cancel: {
              label: 'No',
            },
            confirm: {
              label: 'Yes, Delete',
            },
          },
        })
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this.timelineSetupCommandService.statusDelete(payload).subscribe({
              next: response => {
                console.log('response', response);
                this.reloadCurrentPage();
              },
              error: err => {
                console.error('Status Delete failed!', err);
              },
            });
          }
        });
    }
  }

  createNewEntry() {
    this._router.navigate(['timeline-management', 'create']);
  }

  goToView(id: string) {
    this._router.navigate(['timeline-management', 'edit', id]);
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
