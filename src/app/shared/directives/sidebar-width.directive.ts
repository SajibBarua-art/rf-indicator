import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { FuseNavigationService } from '@platform-ui/platform-bootstrap-template';
import { FuseVerticalNavigationComponent } from '@platform-ui/platform-bootstrap-template';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[appSidebarOffsetWidth]',
  standalone: true,
})
export class SidebarOffsetWidthDirective implements AfterViewInit, OnDestroy {
  private readonly _fuseNavigationService = inject(FuseNavigationService);
  private readonly elementRef = inject(ElementRef);

  private resizeSubscription: Subscription;

  sidebarWidth = signal<number>(0);

  ngAfterViewInit() {
    this.calculateSidebarWidth();

    this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => {
      this.calculateSidebarWidth();
    });
  }

  ngOnDestroy() {
    this.resizeSubscription?.unsubscribe();
  }

  private calculateSidebarWidth() {
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        'mainNavigation'
      );

    if (navigation?.opened) {
      const element = document.querySelector(
        '.fuse-vertical-navigation-wrapper'
      ) as HTMLElement;

      if (element) {
        this.sidebarWidth.set(element.offsetWidth);
      }
    } else {
      this.sidebarWidth.set(0);
    }
    this.updateElementStyle();
  }

  private updateElementStyle() {
    const element = this.elementRef.nativeElement as HTMLElement;
    element.style.width = `calc(100% - ${this.sidebarWidth()}px)`;
  }
}
