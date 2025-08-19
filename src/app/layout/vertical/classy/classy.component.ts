import { CommonModule, NgIf } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import {
  NavigationProvider,
  UserDataService,
} from '@platform-ui/platform-core/services';
import { FuseMediaWatcherService } from '@platform-ui/platform-bootstrap-template/@fuse';

import { UserModel } from '@platform-ui/platform-core/models';
import {
  FuseLoadingBarComponent,
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from '@platform-ui/platform-bootstrap-template';
import { UserComponent } from '@/app/shared/components/user/user.component';
/*import { Navigation } from '@platform-ui/platform-bootstrap-template/lib/navigation.types';*/
import { PlatformBreadcrumbsComponent } from '@/app/shared/components/breadcrumbs/breadcrumbs.component';
import { environment } from '@environment';

@Component({
  selector: 'classy-layout',
  templateUrl: './classy.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    PlatformBreadcrumbsComponent,
    FuseLoadingBarComponent,
    FuseVerticalNavigationComponent,
    UserComponent,
    NgIf,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
  ],
  host: { hostID: crypto.randomUUID().toString() },
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: any;
  user: UserModel;
  toggleNavigationValue: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _userDataService: UserDataService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private _navigationProvider: NavigationProvider,
    @Inject('config') private config: typeof environment
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  get version(): string {
    return this.config?.Version;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to navigation data
    this._navigationProvider
      .getCurrentNavigationObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(navigation => {
        this.navigation = {
          ...this.navigation,
          default: navigation,
        };
      });

    // Subscribe to the user service
    this._userDataService
      .getUser()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: UserModel) => {
        this.user = user;
      });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        name
      );
    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
      this.toggleNavigationValue = !this.toggleNavigationValue;
    }
  }
}
