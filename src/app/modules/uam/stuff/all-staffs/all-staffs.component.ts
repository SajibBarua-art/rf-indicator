import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import {
  NgxDatatableModule,
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';

import { MatDialog } from '@angular/material/dialog';
import { NonGroupStaffsQuery, Staff } from '@/app/modules/uam/stuff/staff.type';
import { MatTooltip } from '@angular/material/tooltip';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-all-staffs',
  templateUrl: './all-staffs.component.html',
  styleUrl: './all-staffs.component.css',
  imports: [
    PlatformAdvanceDatatableModule,
    NgxDatatableModule,
    MatTooltip,
    PlatformButtonComponent,
    TranslocoModule,
  ],
})
export class AllStaffsComponent {
  public readonly data = input<{
    SelectedIds?: string[];
    GroupId?: string;
    InstantSelect?: boolean;
  }>();
  @Output() dataEvent = new EventEmitter<string[]>();

  public dialog = inject(MatDialog);

  public readonly datatableConfig = computed(() => {
    return new PlatformAdvanceDatatableOptions({
      TableConfigId: 'staff-list-table-non-group',
      LogicExecutorService: {
        callbackDataTablePayload: payload => {
          return this.createDataTablePayload(payload);
        },
      },
      SelectedIds: this.data()?.SelectedIds,
    });
  });

  selectedUsers: Staff[] = [];
  queryFilter: NonGroupStaffsQuery = {
    Filters: {},
  };

  constructor() {
    effect(() => {
      this.selectedUsers =
        this.data()?.SelectedIds?.map(x => {
          return { Id: x } as Staff;
        }) || [];
    });
  }

  createDataTablePayload(payload) {
    const payloadFormatted = {
      PageNumber: payload?.Page,
      PageSize: payload?.PageSize,
      Descending: payload?.Descending,
      OrderBy: payload?.OrderBy,
      SearchValue: payload?.Filter?.Search || '',
      GroupId: this.data().GroupId,
      Filters: { ...payload?.Filter, ProgramID: payload?.Filter.CoreProgramID },
    };
    if (payloadFormatted?.Filters.ProgramID)
      Number(payloadFormatted?.Filters.ProgramID);
    if (payloadFormatted?.Filters.ProjectID)
      Number(payloadFormatted?.Filters.ProjectID);
    if (payloadFormatted?.Filters.DivisionID)
      Number(payloadFormatted?.Filters.DivisionID);
    if (payloadFormatted?.Filters.DistrictID)
      Number(payloadFormatted?.Filters.DistrictID);

    if (payload?.Filter?.CoreProgramID) {
      delete payloadFormatted.Filters.CoreProgramID;
    }

    return payloadFormatted;
  }

  selectData(users: Staff[]): void {
    this.selectedUsers = users;
    if (this.data().InstantSelect) {
      this.dataEvent.emit(this.selectedUsers.map(user => user.Id));
    }
  }

  confirmUserAdd(): void {
    this.dataEvent.emit(this.selectedUsers.map(user => user.Id));
  }
}
