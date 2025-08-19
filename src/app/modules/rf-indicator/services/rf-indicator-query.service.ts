import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RFIndicatorCommandPayload } from '../data/rf-indicator.type';
import { PlatformQueryService } from '@platform-ui/platform-core/services';
import { RF_INDICATOR_QUERY_TEMPLATES } from '@/app/modules/rf-indicator/data/rf-indicator.constant';

@Injectable({
  providedIn: 'root',
})
export class RfIndicatorQueryService {
  private readonly queryService = inject(PlatformQueryService);

  getById(id: string): Observable<RFIndicatorCommandPayload> {
    const pageIndex = 0;
    const pageSize = 1;

    return this.queryService.getOne<RFIndicatorCommandPayload>({
      templateId: RF_INDICATOR_QUERY_TEMPLATES.Details,
      values: [`_id: GUID('${id}')`, '', pageSize, pageIndex],
      dynamicIndices: [1, 1, 1],
    });
  }

  getRFIndicators(): Observable<RFIndicatorCommandPayload[]> {
    // Define pagination for the list
    const pageIndex = 0;
    const pageSize = 1000; // A reasonable default page size for a list
    const filter = ''; // No filter to get all items
    const sort = ''; // No specific sort order

    // Use queryService.getAll to receive an array
    return this.queryService.getAll<RFIndicatorCommandPayload>({
      templateId: RF_INDICATOR_QUERY_TEMPLATES.List,
      values: [filter, sort, pageSize, pageIndex],
      dynamicIndices: [1, 1, 1],
    });
  }
}
