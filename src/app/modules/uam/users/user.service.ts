import { Inject, Injectable } from '@angular/core';
import {
  PlatformCommandResponse,
  PlatformCommandService,
  PlatformQueryService,
  UtilityService,
} from '@platform-ui/platform-core/services';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { orderBy } from 'lodash';
import { USER_COMMAND_TYPES } from '@/app/modules/uam/users/data/constants/user.constants';
import { environment } from '@environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    @Inject('config') private readonly config: typeof environment,
    private readonly commandService: PlatformCommandService,
    private readonly utilityService: UtilityService,
    private readonly queryService: PlatformQueryService
  ) {}

  create(payload: User): Observable<boolean> {
    const command = payload.UserId
      ? USER_COMMAND_TYPES.UPDATE
      : USER_COMMAND_TYPES.CREATE;

    const userPayload = !payload.UserId
      ? {
          ...payload,
          UserId: this.utilityService.getNewGuid(),
        }
      : payload;

    return this.commandService.post(command, userPayload).pipe(
      switchMap(response =>
        this.handleCommandResponse(response, userPayload.UserId)
      ),
      catchError(error => {
        console.error('Error creating/updating user:', error);
        return of(false);
      })
    );
  }

  private handleCommandResponse(
    response: PlatformCommandResponse,
    userId: string
  ): Observable<boolean> {
    return this.commandService
      .waitForPushNotification(response.CorrelationId)
      .pipe(
        switchMap(notificationResponse =>
          notificationResponse === 0
            ? this.getById(userId).pipe(map(() => true))
            : of(true)
        )
      );
  }

  getById(id: string): Observable<User> {
    const filterString = `_id: GUID('${id}')`;
    return this.queryService
      .getAll<User>({
        templateId: `UserQuery`,
        values: [filterString, '', 1, 0],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(
        map(users => users[0]),
        catchError(error => {
          console.error('Error fetching user by ID:', error);
          return of(null);
        })
      );
  }

  getAll(search: string = ''): Observable<User[]> {
    const filterString = this.buildSearchFilter(search);
    return this.queryService
      .getAll<User>({
        templateId: `UserQuery`,
        values: [filterString, '-CreatedDate', 10, 0],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      );
  }

  private buildSearchFilter(search: string): string {
    if (!search?.length) {
      return 'UserStatusId: 0';
    }

    return `$or: [
      { 'FirstName': { $regex: '${search}', $options: 'i'} },
      { 'LastName': { $regex: '${search}', $options: 'i'}},
      { 'PinNumber': { $regex: '${search}', $options: 'i'}},
      {'DemarcationName': { $regex: '${search}', $options: 'i'}, UserStatusId: 0}
    ]`;
  }

  activateUser(id: string): Observable<PlatformCommandResponse> {
    return this.commandService
      .post(
        USER_COMMAND_TYPES.ACTIVATE,
        { UserId: id },
        { WaitForNotification: true }
      )
      .pipe(
        catchError(error => {
          console.error('Error activating user:', error);
          return of(null);
        })
      );
  }

  suspendUser(payload: {
    UserId: string;
    Remark?: string;
  }): Observable<PlatformCommandResponse> {
    return this.commandService
      .post(USER_COMMAND_TYPES.SUSPEND, payload, { WaitForNotification: true })
      .pipe(
        catchError(error => {
          console.error('Error suspending user:', error);
          return of(null);
        })
      );
  }

  getApproversByUserId(userId: string): Observable<any[]> {
    const filterString = `'Approvers.UserId': GUID('${userId}')`;
    const payload = [
      {
        templateId: `ApprovalStepConfigQuery`,
        values: [filterString, '', 250, 0],
        dynamicIndices: [1, 1, 1],
      },
    ];

    return this.queryService.getAll(payload).pipe(
      map((response: any[]) => this.transformApprovers(response)),
      catchError(error => {
        console.error('Error fetching approvers:', error);
        return of([]);
      })
    );
  }

  private transformApprovers(response: any[]): any[] {
    return orderBy(
      response.flatMap((item: any) =>
        item.flatMap((LastUpdatedDate: any) => ({
          LastUpdatedDate: LastUpdatedDate.LastUpdatedDate,
          StepName: LastUpdatedDate.StepName || 'No Step Name',
          StepId: LastUpdatedDate.StepId,
          ApprovalFlowId: LastUpdatedDate.ApprovalFlowId,
        }))
      )
    );
  }

  getWorkflowNameByApprovalFlowId(approvalFlowIds: string[]): Observable<any> {
    const approvalIdsAsGUIDs = approvalFlowIds
      .map(id => `GUID('${id}')`)
      .join(',');
    const filterString = `ApprovalFlowId: {$in: [${approvalIdsAsGUIDs}]}`;

    return this.queryService
      .getAll({
        templateId: `ApprovalQuery`,
        values: [filterString, '', 10, 0],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(
        catchError(error => {
          console.error('Error fetching workflow names:', error);
          return of([]);
        })
      );
  }
}
