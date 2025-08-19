import { Inject, inject, Injectable } from '@angular/core';
import { PlatformQueryService } from '@platform-ui/platform-core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environment';
import { type Feature } from '@/app/modules/uam/roles/data/types/feature.type';
import { ROLES_CONFIG } from '@/app/modules/uam/roles/data/constants/roles.constant';

export enum StatusEnum {
  Default,
  Pending,
  Failed,
}

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private readonly queryService = inject(PlatformQueryService);

  constructor(@Inject('config') private readonly config: typeof environment) {}

  /**
   * Get All features
   * @returns Observable<Feature[]>
   */
  getGroupByAll(): Observable<Feature[]> {
    const pageIndex = 0;
    const pageSize = 250;

    return this.queryService
      .getAll({
        templateId: ROLES_CONFIG.QUERY_TEMPLATES.Feature,
        values: ['', pageSize, pageIndex],
        dynamicIndices: [1, 0, 1],
      })
      .pipe(
        map((features): Feature[] => {
          return features as Feature[];
        })
      );
  }
}
