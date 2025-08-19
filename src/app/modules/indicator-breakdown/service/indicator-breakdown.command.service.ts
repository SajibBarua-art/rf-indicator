import { inject, Injectable } from '@angular/core';
import { PlatformCommandService } from '@platform-ui/platform-core/services';
import { BREAKDOWN_COMMANDS } from '../data/indicator-breakdown.constant';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndicatorBreakdownCommandService {
  private readonly commandService = inject(PlatformCommandService);

  Update(commandPayload) {
    const command = BREAKDOWN_COMMANDS.Edit;
    return this.commandService
      .post(command, commandPayload, {
        WaitForNotification: true,
      })
      .pipe(take(1));
  }
}
