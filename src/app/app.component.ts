import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlatformCoreServicesModule } from '@platform-ui/platform-core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, PlatformCoreServicesModule],
  providers: [],
})
export class AppComponent {
  /**
   * Constructor
   */
  constructor() {}
}
