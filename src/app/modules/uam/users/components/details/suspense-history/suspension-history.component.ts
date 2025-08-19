import { Component, inject, signal } from '@angular/core';
import {
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import { ActivatedRoute } from '@angular/router';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { USER_TABLE_CONFIG_IDS } from '@/app/modules/uam/users/data/constants/user.constants';

@Component({
  selector: 'app-suspension-profile',
  templateUrl: './suspension-history.component.html',
  imports: [PlatformAdvanceDatatableModule],
})
export class SuspensionHistoryComponent {
  route = inject(ActivatedRoute);

  datatableConfig = signal<PlatformAdvanceDatatableOptions>(null);

  constructor() {
    const user: User = this.route.parent?.snapshot.data['user'];

    if (user?.Id) {
      this.datatableConfig.set({
        TableConfigId: USER_TABLE_CONFIG_IDS.TABLE_USER_SUSPENSION_HISTORY_LIST,
        CustomFilterQuery: `{UserId: GUID('${user.Id}')}`,
      });
    }
  }
}
