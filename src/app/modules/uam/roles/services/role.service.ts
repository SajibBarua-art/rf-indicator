import { Inject, inject, Injectable } from '@angular/core';
import {
  PlatformCommandResponse,
  PlatformCommandService,
  PlatformQueryService,
  UtilityService,
} from '@platform-ui/platform-core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@environment';
import { type Role } from '@/app/modules/uam/roles/data/types/role.type';
import {
  ROLE_NOTIFICATIONS,
  ROLES_CONFIG,
} from '@/app/modules/uam/roles/data/constants/roles.constant';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly commandService = inject(PlatformCommandService);
  private readonly queryService = inject(PlatformQueryService);
  private readonly utilityService = inject(UtilityService);
  private readonly router = inject(Router);

  constructor(@Inject('config') private readonly config: typeof environment) {}

  create(payload: Role): Observable<PlatformCommandResponse> {
    const isUpdate = !!payload.RoleId;
    const command = isUpdate
      ? ROLES_CONFIG.COMMAND_TYPES.UPDATE
      : ROLES_CONFIG.COMMAND_TYPES.CREATE;

    if (isUpdate) {
      payload = {
        ...payload,
        UsersToBeAdded: payload.UsersToBeAdded ?? [],
        UsersToBeRemoved: payload.UsersToBeRemoved ?? [],
      };
    } else {
      payload.RoleId = this.utilityService.getNewGuid();
    }

    return this.commandService.post(command, payload, {
      WaitForNotification: true,
      NotificationValue: isUpdate
        ? ROLE_NOTIFICATIONS.Update
        : ROLE_NOTIFICATIONS.Create,
    });
  }

  assign(payload: Role): Observable<PlatformCommandResponse> {
    const updatedPayload = {
      ...payload,
      UsersToBeAdded: payload.UsersToBeAdded ?? [],
      UsersToBeRemoved: payload.UsersToBeRemoved ?? [],
    };

    return this.commandService.post(
      ROLES_CONFIG.COMMAND_TYPES.UPDATE,
      updatedPayload,
      {
        WaitForNotification: true,
        SkipToast: true,
      }
    );
  }

  getById(id: string): Observable<Role> {
    const filter = `_id: GUID('${id}')`;
    return this.queryService
      .getAll({
        templateId: ROLES_CONFIG.QUERY_TEMPLATES.Role,
        values: [filter, '', 1, 0],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(map(response => response.at(0) as Role));
  }

  getAll(): Observable<Role[]> {
    return this.queryService
      .getAll({
        templateId: ROLES_CONFIG.QUERY_TEMPLATES.Role,
        values: ['', ROLES_CONFIG.PAGE_SIZE, 0],
        dynamicIndices: [1, 0, 1],
      })
      .pipe(map(response => response as Role[]));
  }

  async navigateToListPage(): Promise<void> {
    await this.router.navigate(['roles']);
  }

  async navigateToDetailsPage(id: string): Promise<void> {
    await this.router.navigate(['roles', ROLES_CONFIG.ROUTES.DETAILS, id]);
  }

  async navigateToEditPage(id: string): Promise<void> {
    await this.router.navigate(['roles', ROLES_CONFIG.ROUTES.EDIT, id]);
  }

  async navigateToRecipientsPage(id: string): Promise<void> {
    await this.router.navigate([
      'roles',
      ROLES_CONFIG.ROUTES.DETAILS,
      id,
      ROLES_CONFIG.ROUTES.RECIPIENTS,
    ]);
  }

  async navigateToAssignPage(id: string): Promise<void> {
    await this.router.navigate([
      'roles',
      ROLES_CONFIG.ROUTES.DETAILS,
      id,
      ROLES_CONFIG.ROUTES.ASSIGN,
    ]);
  }
}
