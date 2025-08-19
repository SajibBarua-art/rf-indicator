import { inject, Injectable } from '@angular/core';
import { PlatformQueryService } from '@platform-ui/platform-core/services';
import { Observable } from 'rxjs';
import { TIMELINE_SETUP_QUERY_TEMPLATES } from '../data/timeline-setup.constant';

@Injectable({
  providedIn: 'root',
})
export class TimelineSetupQueryService {
  private readonly queryService = inject(PlatformQueryService);

  getById(id: string): Observable<any> {
    const pageIndex = 0;
    const pageSize = 1;

    return this.queryService.getOne<any>({
      templateId: TIMELINE_SETUP_QUERY_TEMPLATES.Details,
      values: [`_id: GUID('${id}')`, '', pageSize, pageIndex],
      dynamicIndices: [1, 1, 1],
    });
  }
}
