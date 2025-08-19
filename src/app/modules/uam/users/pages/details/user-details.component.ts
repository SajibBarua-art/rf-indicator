import {
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import {
  PlatformButtonComponent,
  PlatformCardComponent,
} from '@platform-ui/platform-bootstrap-template';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { UserService } from '@/app/modules/uam/users/user.service';
import { PlatformNavigationItem } from '@platform-ui/platform-core/models';
import { DetailsHeaderComponent } from '@/app/shared/components/details-header/details-header.component';
import { SuspensionProfileComponent } from '@/app/modules/uam/users/components/details/suspension-profile/suspension-profile.component';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  USER_DIALOG_CONFIG,
  USER_FEATURES,
} from '@/app/modules/uam/users/data/constants/user.constants';
import { PlatformFeatureGuardModule } from '@platform-ui/platform-feature-guard';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslocoDirective,
    PlatformButtonComponent,
    PlatformCardComponent,
    DetailsHeaderComponent,
    PlatformFeatureGuardModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UserDetailsComponent {
  // Injected services
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  // Component state
  protected readonly user = signal<User>(this.route.snapshot.data['user']);
  protected readonly navigations = computed<PlatformNavigationItem[]>(() =>
    this.generateNavigations(this.user())
  );
  protected readonly isFullDetails = signal<boolean>(
    this.router.url.includes('profile')
  );
  protected readonly USER_FEATURES = USER_FEATURES;

  constructor() {
    this.setupUrlListener();
  }

  protected showSuspendDialog(): void {
    const dialogRef = this.dialog.open<SuspensionProfileComponent>(
      SuspensionProfileComponent,
      {
        width: USER_DIALOG_CONFIG.WIDTH,
        data: this.user(),
      }
    );

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => this.refreshUserData()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private refreshUserData(): void {
    const currentUser = this.user();
    if (currentUser?.Id) {
      this.userService.getById(currentUser.Id).subscribe(user => {
        this.user.set(user);
        this.router.navigate([`/users/details/${user.Id}`]);
      });
    }
  }

  private generateNavigations(user: User): PlatformNavigationItem[] {
    return [
      {
        id: 'profile',
        type: 'basic',
        url: `/users/details/${user?.Id}/profile`,
        title: 'Details',
      },
      {
        id: 'log',
        type: 'basic',
        url: `/users/details/${user?.Id}/log`,
        title: 'Log',
      },
    ];
  }

  protected handleBack(): void {
    this.router.navigate(['users']);
  }

  private setupUrlListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.isFullDetails.set(this.router.url.includes('profile'));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
