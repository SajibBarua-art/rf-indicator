import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@platform-ui/platform-bootstrap-template/@fuse';

@Component({
  selector: 'app-users-profile-log',
  templateUrl: './users-profile-log.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  imports: [],
})
export class UsersProfileLogComponent {
  /**
   * Constructor
   */
  constructor() {}
}
