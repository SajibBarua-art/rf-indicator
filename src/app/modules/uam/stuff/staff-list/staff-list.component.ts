import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import { StaffService } from '@/app/modules/uam/stuff/staff.service';
import { Staff } from '@/app/modules/uam/stuff/staff.type';
import { ProfileDetailsDialogComponent } from '@/app/modules/uam/profile/profile-details-dialog/profile-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  imports: [PlatformAdvanceDatatableModule],
})
export class StaffListComponent implements AfterViewInit {
  @Input() set preSelectedIds(data: string[]) {
    this.datatableOptions.set({
      TableConfigId: 'staff-list-table',
      CustomFilterQuery: '{MobileNo: { $ne : null }, IsExternal : false}',
      SelectedRowsFn: () => {
        return data?.map(x => {
          return {
            Id: x.toLowerCase(),
          };
        });
      },
    });
  }
  @Output() selectedStaff: EventEmitter<Staff[]> = new EventEmitter();
  @Output() deSelectedStaff: EventEmitter<Staff> = new EventEmitter();

  selected: Staff[] = [];
  datatableOptions = signal<PlatformAdvanceDatatableOptions>(null);

  public staffService = inject(StaffService);
  public _dialog = inject(MatDialog);

  ngAfterViewInit(): void {
    this.datatableOptions.set({
      TableConfigId: 'staff-list-table',
      CustomFilterQuery: '{MobileNo: { $ne : null }, IsExternal : false}',
    });
  }

  sideBarAction($event: {
    Action: { SidebarName: string };
    RowData: Staff;
  }): void {
    if ($event?.Action?.SidebarName === 'view') {
      this.showDetails($event?.RowData);
    }
  }

  showDetails(RowData?: Staff) {
    const dialogRef = this._dialog.open(ProfileDetailsDialogComponent, {
      width: '80vw',
      data: RowData,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  selectData(data: Staff[]): void {
    this.selectedStaff.emit(data);
  }

  deSelectData(staff: Staff): void {
    this.deSelectedStaff.emit(staff);
  }
}
