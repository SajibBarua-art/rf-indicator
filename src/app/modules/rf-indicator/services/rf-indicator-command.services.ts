import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { PlatformCommandService } from '@platform-ui/platform-core/services';
import {
  RF_INDICATOR_COMMANDS,
  RF_INDICATOR_STATUS_SUCCESS_KEY,
} from '@/app/modules/rf-indicator/data/rf-indicator.constant';
import { RFIndicatorCommandPayload } from '@/app/modules/rf-indicator/data/rf-indicator.type';

@Injectable({
  providedIn: 'root',
})
export class RfIndicatorCommandService {
  private readonly commandService = inject(PlatformCommandService);

  saveDraft(commandPayload: RFIndicatorCommandPayload, isNew: boolean = true) {
    let command = RF_INDICATOR_COMMANDS.Create;
    if (!isNew) {
      command = RF_INDICATOR_COMMANDS.EditDraft;
    }
    return this.commandService
      .post<RFIndicatorCommandPayload>(command, commandPayload, {
        WaitForNotification: true,
        NotificationValue: RF_INDICATOR_STATUS_SUCCESS_KEY.Draft,
      })
      .pipe(take(1));
  }

  Create(commandPayload) {
    const command = RF_INDICATOR_COMMANDS.Create;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }
  Update(commandPayload) {
    const command = RF_INDICATOR_COMMANDS.Update;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }
  statusUpdate(commandPayload) {
    console.log('commandPayload', commandPayload);

    const command = RF_INDICATOR_COMMANDS.StatusUpdate;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }
}
