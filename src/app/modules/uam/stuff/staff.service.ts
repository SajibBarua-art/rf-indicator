import { Inject, inject, Injectable } from '@angular/core';
import { PlatformQueryService } from '@platform-ui/platform-core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Staff } from './staff.type';
import { User } from '@/app/modules/uam/users/data/types/user.type';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private _serviceId = 'sms';
  public queryService = inject(PlatformQueryService);

  constructor(@Inject('config') private config: any) {}

  /**
   * Get By Id
   */
  getById(id: string): Observable<Staff> {
    const pageIndex = 0;
    const pageSize = 250;

    return this.queryService
      .getAll({
        templateId: 'RoleFindByIdQuery',
        values: [id, '', pageSize, pageIndex],
        serviceId: this._serviceId,
        dynamicIndices: [1, 1, 1],
      })
      .pipe(map(response => response.at(0) as Staff));
  }

  /**
   * Get All data
   */
  getAll(search: string = ''): Observable<Staff[]> {
    const filterString =
      search?.length > 0
        ? `$or: [{ 'StaffPIN': { $regex: '${search}', $options: 'i'} },{ 'StaffName': { $regex: '${search}', $options: 'i'} }]`
        : '';
    return this.queryService.getAll({
      templateId: `${this.config.ServiceId}StuffViewQuery`,
      values: [filterString, '-CreatedDate', 10, 0],
      serviceId: this._serviceId,
      dynamicIndices: [1, 1, 1],
    });
  }

  getByPin(pin): Observable<Staff> {
    return this.queryService.getOne<Staff>({
      templateId: `StuffViewQuery`,
      values: [`StaffPIN: '${pin}'`, '', 1, 0],
      serviceId: 'dataservice',
      dynamicIndices: [1, 1, 1],
    });
  }

  getStaffAsUser(pin: string): Observable<User> {
    return this.getByPin(pin).pipe(
      map(staff => {
        return staff
          ? ({
              Id: staff.Id,
              UserName: staff.StaffPIN,
              Email: staff.EmailID,
              Sex: staff.Sex,
              DateOfBirth: staff.DateOfBirth,
              JobLevel: staff.JobLevel,
              UserStatusText: this.getStatusName(staff.Status)?.label,
              JoiningDate: staff.JoiningDate,
              BkashNumber: staff.BKashNo,
              DemarcationName: staff.CoreProgramName,
              Designation: staff.DesignationName,
            } as User)
          : null;
      })
    );
  }

  getStatusName(statusCode: string): { label: string; type: string } {
    switch (statusCode) {
      case 'A':
        return { label: 'Dead', type: 'inactive' };
      case 'B':
        return { label: 'Termination of Count', type: 'inactive' };
      case 'C':
        return { label: 'Confirm', type: 'default' };
      case 'D':
        return { label: 'Dismissed', type: 'warning' };
      case 'E':
        return { label: 'End Contract', type: 'inactive' };
      case 'F':
        return { label: 'Close File', type: 'inactive' };
      case 'G':
        return { label: 'Discontinuation', type: 'inactive' };
      case 'H':
        return { label: 'Retrenchment', type: 'inactive' };
      case 'I':
        return { label: 'Discharge', type: 'inactive' };
      case 'L':
        return { label: 'Left', type: 'inactive' };
      case 'M':
        return { label: 'Retirement', type: 'inactive' };
      case 'N':
        return { label: 'Non Confirm', type: 'warning' };
      case 'O':
        return { label: 'Redundancy', type: 'warning' };
      case 'P':
        return { label: 'Contract Discontinue', type: 'inactive' };
      case 'R':
        return { label: 'Resignation', type: 'warning' };
      case 'S':
        return { label: 'Suspended', type: 'warning' };
      case 'T':
        return { label: 'Termination', type: 'warning' };
      default:
        return { label: 'Unknown', type: 'inactive' };
    }
  }
}
