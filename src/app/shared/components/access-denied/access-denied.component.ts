import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'access-denied',
  templateUrl: './access-denied.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class AccessDeniedComponent {
  /**
   * Constructor
   */
  constructor() {}
}
