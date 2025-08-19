import { BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  FeatureProvider,
  PlatformLoginService,
  UserDataService,
} from '@platform-ui/platform-core/services';
import { UserModel } from '@platform-ui/platform-core/models';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    TranslocoDirective,
  ],
  host: { hostID: crypto.randomUUID().toString() },
})
export class UserComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_showAvatar: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() showAvatar: boolean = false;
  user: UserModel;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _platformLoginService: PlatformLoginService,
    private _userDataService: UserDataService,
    private _featureProvider: FeatureProvider
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    this._userDataService
      .getUser()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.user = user;

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
   * Update the user status
   *
   * @param status
   */
  updateUserStatus(status: string): void {
    console.log(status);
  }

  /**
   * Sign out
   */
  signOut(): void {
    this._platformLoginService.logout().subscribe({
      next: () => {
        this._clearUserData();
      },
      error: () => {
        this._clearUserData();
      },
    });
  }

  gotoProfile() {
    this._router.navigate(['profile']).then();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _clearUserData(): void {
    this._userDataService.resetUserData();
    this._featureProvider.resetFeatures();

    window.location.href = this._platformLoginService.prepareKeycloakLoginUrl();
  }
}
