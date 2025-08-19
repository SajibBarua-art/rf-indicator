import { Component, Inject, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import { Subject, takeUntil } from 'rxjs';
import { RoleService } from '../../services/role.service';
import {
  Role,
  UserStaffInfo,
} from '@/app/modules/uam/roles/data/types/role.type';
import { Staff } from '@/app/modules/uam/stuff/staff.type';
import { StaffService } from '@/app/modules/uam/stuff/staff.service';
import { ProfileDetailsDialogComponent } from '@/app/modules/uam/profile/profile-details-dialog/profile-details-dialog.component';
import {
  PlatformButtonComponent,
  PlatformConfirmationService,
} from '@platform-ui/platform-bootstrap-template';
import { TranslocoDirective } from '@ngneat/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PlatformCommandService,
  UserDataService,
} from '@platform-ui/platform-core/services';
import { environment } from '@environment';

@Component({
  selector: 'app-role-assign-list',
  templateUrl: './role-assign-list.component.html',
  imports: [
    PlatformAdvanceDatatableModule,
    MatDialogModule,
    PlatformButtonComponent,
    TranslocoDirective,
  ],
})
export class RoleAssignListComponent {
  public roleService = inject(RoleService);
  public staffService = inject(StaffService);
  public _dialog = inject(MatDialog);
  public _platformConfirmationService = inject(PlatformConfirmationService);
  public commandService = inject(PlatformCommandService);
  public userDataService = inject(UserDataService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public dialog = inject(MatDialog);

  private unsubscribe$ = new Subject<void>();
  role: Role;
  datatableConfigOptions = signal<PlatformAdvanceDatatableOptions>(null);

  selectedUsers: UserStaffInfo[] = [];
  removedUserIds: string[] = [];
  isSaving = false;

  constructor(@Inject('config') private config: typeof environment) {
    this.role = this.route.parent.snapshot.data['role'];
    const userData = this.userDataService.getUserData();
    const isAdmin = this.userDataService.getUserData().Role.includes('admin');
    const demarcationQueryFilterString = !isAdmin
      ? `, ${this.config?.DemarcationField?.Id}: ${userData?.DemarcationId || '-1'}`
      : ``;

    this.datatableConfigOptions.set({
      TableConfigId: 'staff-list-table',
      CustomFilterQuery: `{MobileNo: { $ne : null }, IsExternal : { $ne : true } ${demarcationQueryFilterString}}`,
      SelectedRowsFn: (rows: Staff[]) => {
        let selectedIds = Array.from(
          new Set([
            ...this.role?.PinNumbers,
            ...(this.selectedUsers.map(x => x.PinNumber) || []),
          ])
        );

        selectedIds = selectedIds.filter(
          pin => !this.removedUserIds.includes(pin)
        );

        return rows.filter(x => selectedIds?.includes(x.StaffPIN));
      },
    });
  }

  onSelectData(staffs: Staff[]): void {
    this.selectedUsers = staffs.map(staff => {
      const nameParts = staff.StaffName?.trim().split(' ') || [];
      const lastName = nameParts.pop() || '';
      const firstName = nameParts.join(' ');
      const demarcationIdField =
        this.config.DemarcationField?.Id || 'CoreProgramID';
      const demarcationNameField =
        this.config.DemarcationField?.Name || 'CoreProgramName';

      return {
        PinNumber: staff.StaffPIN,
        Username: staff.StaffPIN,
        FirstName: firstName,
        LastName: lastName,
        DateOfBirth: staff.DateOfBirth,
        Age: staff.Age,
        Sex: staff.Sex,
        Email: staff.EmailID,
        PhoneNumber: staff.MobileNo,
        BkashNumber: staff.BKashNo,
        JobLevel: staff.JobLevel,
        Designation: staff.DesignationName,
        DemarcationId: staff[demarcationIdField]?.toString(),
        DemarcationName: staff[demarcationNameField]?.toString(),
        Religion: staff.Religion,
        JoiningDate: staff.JoiningDate,
      } as UserStaffInfo;
    });

    const selectedIds = this.selectedUsers.map(user => user.PinNumber);
    this.removedUserIds = this.removedUserIds.filter(
      id => !selectedIds.includes(id)
    );
  }

  deSelectData(staff: Staff): void {
    const staffPin = staff?.StaffPIN;
    if (this.role?.PinNumbers.includes(staffPin)) {
      if (!this.removedUserIds.includes(staffPin))
        this.removedUserIds.push(staffPin);
    }
  }

  cancelRoleAssign(): void {
    this.router.navigate(['roles']).then();
  }

  confirmRoleAssign(): void {
    if (this.selectedUsers && this.role.Id) {
      const confirmation = this._platformConfirmationService.open({
        title: 'Confirm Role Assign',
        message: 'Are you sure you want to assign this Role?',
        actions: {
          confirm: {
            label: 'Assign Role',
          },
        },
      });

      confirmation.afterClosed().subscribe(result => {
        if (result) {
          this.isSaving = true;
          const filteredUsersTobeAdded = this.role?.PinNumbers
            ? this.selectedUsers.filter(
                x => !this.role.PinNumbers.includes(x.PinNumber)
              )
            : this.selectedUsers;
          const payload = {
            RoleId: this.role.Id,
            RoleUniqName: this.role.RoleUniqName,
            RoleDisplayName: this.role.RoleDisplayName,
            Description: this.role.Description,
            ParentRoles: this.role.ParentRoles || [],
            IsActive: this.role.IsActive,
            UsersToBeAdded: filteredUsersTobeAdded || {},
            UsersToBeRemoved: this.removedUserIds,
            FeatureIdsToBeAdded: [],
            FeatureIdsToBeRemoved: [],
          } as Role;

          this.roleService
            .assign(payload)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(response => {
              this.isSaving = false;
              if (response.Success) {
                // this.dialogRef.close(isAssignSuccess);
                this.commandService.showResponseToastMessage(
                  'RoleAssignedSuccessfully',
                  'Success'
                );
                this.roleService.navigateToListPage().then();
              }
              this.unsubscribe$.next();
              this.unsubscribe$.complete();
            });
        }
      });
    }
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
}
