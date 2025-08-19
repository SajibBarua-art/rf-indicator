import { inject, Injectable } from '@angular/core';
import { PlatformQueryService } from '@platform-ui/platform-core/services';
import { TARGET_SETUP_QUERY_TEMPLATES } from '@/app/modules/target-setup/data/constants/target-setup.constant';
import { TargetSetupCommandPayload } from '@/app/modules/target-setup/data/target-setup.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TargetSetupQueryService {
  private readonly queryService = inject(PlatformQueryService);

  getById(id: string): Observable<TargetSetupCommandPayload> {
    const pageIndex = 0;
    const pageSize = 1;

    return this.queryService.getOne<TargetSetupCommandPayload>({
      templateId: TARGET_SETUP_QUERY_TEMPLATES.Details,
      values: [`_id: GUID('${id}')`, '', pageSize, pageIndex],
      dynamicIndices: [1, 1, 1],
    });
  }

  getAll(): Observable<TargetSetupCommandPayload[]> {
    // Define pagination for the list
    const pageIndex = 0;
    const pageSize = 1000; // A reasonable default page size for a list
    const filter = ''; // No filter to get all items
    const sort = ''; // No specific sort order

    // Use queryService.getAll to receive an array
    return this.queryService.getAll<TargetSetupCommandPayload>({
      templateId: TARGET_SETUP_QUERY_TEMPLATES.List,
      values: [filter, sort, pageSize, pageIndex],
      dynamicIndices: [1, 1, 1],
    });
  }
}
