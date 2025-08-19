import { Component, inject, OnDestroy } from '@angular/core';
import { DetailsHeaderComponent } from '@/app/shared/components/details-header/details-header.component';
import {
  PlatformButtonComponent,
  PlatformCardComponent,
} from '@platform-ui/platform-bootstrap-template';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { PlatformNavigationItem } from '@platform-ui/platform-core/models';
import { Role } from '@/app/modules/uam/roles/data/types/role.type';

import { filter, Subject, takeUntil } from 'rxjs';
import { RoleService } from '@/app/modules/uam/roles/services/role.service';
import { PlatformFeatureGuardModule } from '@platform-ui/platform-feature-guard';
import { ROLE_FEATURES } from '@/app/modules/uam/roles/data/constants/roles.constant';

@Component({
  selector: 'app-role-details-container',
  templateUrl: './role-details-container.component.html',
  imports: [
    DetailsHeaderComponent,
    PlatformButtonComponent,
    PlatformCardComponent,
    RouterOutlet,
    TranslocoDirective,
    PlatformFeatureGuardModule,
  ],
})
export class RoleDetailsContainerComponent implements OnDestroy {
  role: Role;
  navigations: PlatformNavigationItem[] = [];
  isShowActionButtons: boolean = false;
  isShowNavMenu: boolean = false;
  unSubscribeAll$ = new Subject<boolean>();
  currentUrl: string = '';

  route = inject(ActivatedRoute);
  router = inject(Router);
  roleService = inject(RoleService);

  constructor() {
    this.role = this.route.snapshot.data['role'];
    this.navigations = this._generateNavigation(this.role);

    this._generateActionButtons('view');
  }

  ngOnDestroy() {
    this.unSubscribeAll$.next(true);
    this.unSubscribeAll$.complete();
  }

  private _generateNavigation(data: Role): PlatformNavigationItem[] {
    return [
      {
        id: 'view',
        type: 'basic',
        url: `/roles/details/${data?.Id}/view`,
        title: 'Details',
      },
      {
        id: 'recipients',
        type: 'basic',
        url: `/roles/details/${data?.Id}/recipients`,
        title: 'Recipients',
      },
      {
        id: 'log',
        type: 'basic',
        url: `/roles/details/${data?.Id}/log`,
        title: 'Log',
      },
    ];
  }

  private _generateActionButtons(urlSegments: string) {
    this.currentUrl = this.router.url;
    this.isShowActionButtons = this.currentUrl?.includes(urlSegments);
    this.isShowNavMenu = window.location.pathname?.indexOf('assign') === -1;
    this.router.events
      .pipe(
        takeUntil(this.unSubscribeAll$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.isShowActionButtons = this.currentUrl?.includes(urlSegments);
        this.isShowNavMenu = !this.currentUrl?.includes('assign');
      });
  }

  protected readonly ROLE_FEATURES = ROLE_FEATURES;
}
