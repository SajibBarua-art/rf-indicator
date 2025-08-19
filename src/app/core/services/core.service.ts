import { inject, Injectable } from '@angular/core';
import { FeatureGuardService } from '@platform-ui/platform-feature-guard';
import { DASHBOARD_FEATURES } from '@/app/modules/dashboard/dashboard.type';

@Injectable({ providedIn: 'root' })
export class CoreService {
  featureGuardService = inject(FeatureGuardService);

  dynamicLandingPage(): string {
    if (
      this.featureGuardService.isValidFeatureSync([
        { Key: DASHBOARD_FEATURES.View },
      ])
    ) {
      return 'dashboard';
    }
    return 'dashboard';
  }
}
