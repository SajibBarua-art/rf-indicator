import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fuseAnimations } from '@platform-ui/platform-bootstrap-template/@fuse';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  standalone: true,
  imports: [RouterOutlet],
  animations: fuseAnimations,
})
export class RolesComponent {}
