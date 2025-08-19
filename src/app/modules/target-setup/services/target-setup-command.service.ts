import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { PlatformCommandService } from '@platform-ui/platform-core/services';
import {
  TARGET_SETUP_COMMANDS,
  TARGET_SETUP_STATUS_SUCCESS_KEY,
} from '@/app/modules/target-setup/data/constants/target-setup.constant';
import {
  DeleteTargetSetupCommandPayload,
  TargetSetupCommandPayload,
} from '@/app/modules/target-setup/data/target-setup.type';

@Injectable({
  providedIn: 'root',
})
export class TargetSetupCommandService {
  private readonly commandService = inject(PlatformCommandService);

  Create(commandPayload: TargetSetupCommandPayload) {
    const command = TARGET_SETUP_COMMANDS.Create;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }

  Update(commandPayload: TargetSetupCommandPayload) {
    const command = TARGET_SETUP_COMMANDS.Update;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }

  itemDelete(commandPayload: DeleteTargetSetupCommandPayload) {
    console.log('Delete Status!', commandPayload);
    const command = TARGET_SETUP_COMMANDS.Delete;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }
}
