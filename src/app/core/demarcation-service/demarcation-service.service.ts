import { Inject, inject, Injectable } from '@angular/core';
import {
  PlatformQueryService,
  UserDataService,
} from '@platform-ui/platform-core/services';
import { catchError, map, Observable, of } from 'rxjs';
import { Program, ProgramName } from './demarcation.type';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class DemarcationService {
  userDataService = inject(UserDataService);
  queryService = inject(PlatformQueryService);

  constructor(@Inject('config') private config: typeof environment) {}
  getProgramId(): Observable<string> {
    return this.userDataService?.currentUserData?.source.pipe(
      map(userData => {
        const programId = userData?.DemarcationId?.toString();
        console.log('Program Id:', programId);
        return programId;
      }),
      catchError(error => {
        console.error('Error fetching Program Id:', error);
        return of(null); // Return null or handle the error appropriately
      })
    );
  }

  isAdmin(): boolean {
    return this.userDataService.getUserData().Role.includes('admin');
  }

  public getProgramNames(search?: string): Observable<ProgramName> {
    const filterString = search
      ? `ItemGroup: { $regex: '${search}', $options: 'i'}`
      : '';
    const payload = [
      {
        templateId: `SeedDataQuery`,
        values: [filterString, '+ItemKey', 100, 0],
        dynamicIndices: [1, 1, 1],
      },
    ];

    return this.queryService.getAll(payload).pipe(
      map(response => {
        return {
          Data: response as Program[],
        };
      })
    );
  }
}
