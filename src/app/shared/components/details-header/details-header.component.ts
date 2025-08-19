import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FuseHorizontalNavigationComponent } from '@platform-ui/platform-bootstrap-template';
import { MatDivider } from '@angular/material/divider';
import { PlatformNavigationItem } from '@platform-ui/platform-core/models';

@Component({
  selector: 'app-details-header',
  templateUrl: './details-header.component.html',
  imports: [FuseHorizontalNavigationComponent, MatDivider],
  host: { hostID: crypto.randomUUID().toString() },
})
export class DetailsHeaderComponent {
  @Input() navigations: PlatformNavigationItem[] = [];
  @Output() backClicked = new EventEmitter<void>();
}
