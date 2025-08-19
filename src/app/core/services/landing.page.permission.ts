import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { FeatureGuardService } from '@platform-ui/platform-feature-guard';
import { ROLE_FEATURES } from '@/app/modules/uam/roles/data/constants/roles.constant';
import { BEP_FEATURES } from '@/app/shared/data/constants/bep.constant';

@Injectable({
  providedIn: 'root',
})
export class LandingPagePermission implements CanActivate {
  private featureGuardService = inject(FeatureGuardService);
  private router = inject(Router);

  private readonly featureNavigationMap = [
    { feature: BEP_FEATURES.View, route: null }, // Landing page
    { feature: ROLE_FEATURES.View, route: 'roles' },
  ];

  canActivate(): MaybeAsync<GuardResult> {
    return this._dynamicLandingPage();
  }

  private _dynamicLandingPage(): boolean {
    for (const { feature, route } of this.featureNavigationMap) {
      if (this.featureGuardService.isValidFeatureSync([{ Key: feature }])) {
        if (route) {
          this.router.navigate([route]).then();
        }
        return true;
      }
    }
    return false;
  }
}
