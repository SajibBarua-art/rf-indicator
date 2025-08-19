import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@platform-ui/platform-bootstrap-template/@fuse';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  imports: [RouterOutlet],
})
export class UsersComponent {
  /**
   * Constructor
   */
  constructor() {}
}
