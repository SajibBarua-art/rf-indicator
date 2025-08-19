import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsComponent } from '@/app/shared/components/notifications/notifications.component';
import { UserComponent } from '@/app/shared/components/user/user.component';
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
import { LanguagesComponent } from '@/app/shared/components/languages/languages.component';
/*import { Navigation } from '@platform-ui/platform-bootstrap-template/lib/navigation.types';*/
import { PlatformBreadcrumbsComponent } from '@/app/shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'dense-layout',
  templateUrl: './dense.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FuseLoadingBarComponent,
    FuseVerticalNavigationComponent,
    MatButtonModule,
    MatIconModule,
    LanguagesComponent,
    NotificationsComponent,
    UserComponent,
    NgIf,
    RouterOutlet,
    PlatformBreadcrumbsComponent,
  ],
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: any;
  navigationAppearance: 'default' | 'dense' = 'default';
  private _unsubscribeAll = new Subject();
  user: UserModel;
  toggleNavigationValue: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _userDataService: UserDataService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private _navigationProvider: NavigationProvider
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

        // Change the navigation appearance
        this.navigationAppearance = this.isScreenSmall ? 'default' : 'dense';
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

  /**
   * Toggle the navigation appearance
   */
  toggleNavigationAppearance(): void {
    this.navigationAppearance =
      this.navigationAppearance === 'default' ? 'dense' : 'default';
  }
}
