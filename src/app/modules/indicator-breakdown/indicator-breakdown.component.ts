import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-indicator-breakdown',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None,
})
export class IndicatorBreakdownComponent {}
