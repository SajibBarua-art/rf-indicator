import { inject, Injectable } from '@angular/core';
import { TIMELINE_SETUP_COMMANDS } from '../data/timeline-setup.constant';
import { take } from 'rxjs';
import { PlatformCommandService } from '@platform-ui/platform-core/services';

@Injectable({
  providedIn: 'root',
})
export class TimelineSetupCommandService {
  private readonly commandService = inject(PlatformCommandService);

  statusDelete(commandPayload) {
    console.log('Delete Status!', commandPayload);
    const command = TIMELINE_SETUP_COMMANDS.Delete;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }
  Create(commandPayload) {
    const command = TIMELINE_SETUP_COMMANDS.Create;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }
  Update(commandPayload) {
    const command = TIMELINE_SETUP_COMMANDS.Update;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }
}
