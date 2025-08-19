import { Inject, inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  PlatformCommandService,
  PlatformQueryService,
  TokenManagerService,
} from '@platform-ui/platform-core/services';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import {
  OptionsCategories,
  RegionLocation,
} from '../data/indicator-breakdown.type';
import { REF_INDICATOR_QUERY_TEMPLATES } from '../data/indicator-breakdown.constant';
import { environment } from '@environment';
import { RFIndicatorCommandPayload } from '../../rf-indicator/data/rf-indicator.type';
import { RF_INDICATOR_QUERY_TEMPLATES } from '../../rf-indicator/data/rf-indicator.constant';

@Injectable({
  providedIn: 'root',
})
export class IndicatorBreakdownService {
  private _details: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _transloco = inject(TranslocoService);
  public commandService = inject(PlatformCommandService);
  private readonly tokenService = inject(TokenManagerService);

  private readonly httpClient = inject(HttpClient);
  constructor(
    private queryService: PlatformQueryService,
    @Inject('config') private readonly config: typeof environment
  ) {}
  public apiUrl = `https://mdn-services.bracits.com/api/rfi/Data`;

  public headers = new HttpHeaders({
    'x-service-id': this.config.ServiceId,
    Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
  });
  getConfigurationIndicatorById(
    id: string
  ): Observable<RFIndicatorCommandPayload> {
    const pageIndex = 0;
    const pageSize = 1;

    return this.queryService.getOne<RFIndicatorCommandPayload>({
      templateId: RF_INDICATOR_QUERY_TEMPLATES.BreakDownDetails,
      values: [`IndicatorId: GUID('${id}')`, '', pageSize, pageIndex],
      dynamicIndices: [1, 1, 1],
    });
  }
  getCategories(): Observable<unknown[]> {
    const pageIndex = 0;
    const pageSize = 10;

    return this.queryService
      .getAll({
        templateId: `OperationCategoryQuery`,
        values: ['', '', pageSize, pageIndex],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(
        tap(response => {
          this._details.next(response.at(0) as OptionsCategories);
        })
      );
  }

  getInstitueType(): Observable<any> {
    const pageIndex = 0;
    const pageSize = 10;

    return this.queryService
      .getAll({
        templateId: `InstituteTypeQuery`,
        values: ['', '', pageSize, pageIndex],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(
        tap(response => {
          this._details.next(response.at(0) as any);
        })
      );
  }

  getLocations(): Observable<any> {
    const pageIndex = 0;
    const pageSize = 250;

    return this.queryService
      .getAll({
        templateId: `LocationQuery`,
        values: ['', '', pageSize, pageIndex],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(
        tap(response => {
          this._details.next(response.at(0) as any);
        })
      );
  }

  getUserRole() {
    const pageIndex = 0;
    const pageSize = 250;

    return this.queryService
      .getAll({
        templateId: `UserCategoryQuery`,
        values: ['', '', pageSize, pageIndex],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(
        tap(response => {
          this._details.next(response.at(0) as any);
        })
      );
  }
  getRegionByInstituteType(
    instituteTypeValue: string
  ): Observable<RegionLocation[]> {
    const pageIndex = 0;
    const pageSize = 100;
    console.log('instituteTypeValue111', instituteTypeValue);

    const filterString = `'InstituteTypes':'${instituteTypeValue}','Category': '${'REGION'}'`;
    return this.queryService
      .getAll<RegionLocation[]>({
        templateId: REF_INDICATOR_QUERY_TEMPLATES.location,
        values: [filterString, '', pageSize, pageIndex],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(map((response: RegionLocation[][]) => response.flat()));
  }
  getAreaListByRegion(
    regionIds: string[] = [],
    pageIndex: number = 0,
    pageSize: number = 1000
  ): Observable<RegionLocation[]> {
    let filterString = `'Category': '${'AREA'}' `;
    if (regionIds.length > 0) {
      filterString += `, 'ParentId': { $in: [${regionIds.map(id => `'${id}'`).join(',')}] }`;
    }

    return this.queryService
      .getAll<any>({
        templateId: REF_INDICATOR_QUERY_TEMPLATES.location,
        values: [filterString, '', pageSize, pageIndex],
        dynamicIndices: [1, 1, 1],
      })
      .pipe(map((response: RegionLocation[][]) => response.flat()));
  }

  getBranchListByArea(
    areaIds: string[] = [],
    pageIndex: number = 1,
    pageSize: number = 100
  ): Observable<RegionLocation[]> {
    const payload = {
      PageNumber: pageIndex,
      ParentIds: areaIds,
    };

    return this.getDataByBusinessService(payload).pipe(
      tap(response => {
        console.log('Raw response:', response);
      }),
      map((response: { Result?: { Data?: RegionLocation[][] } }) => {
        return response?.Result?.Data?.flat() || [];
      })
    );
  }

  getDataByBusinessService(filter: any): Observable<any> {
    return this.httpClient
      .post<{
        response: any;
      }>(`${this.apiUrl}/GetUpazilas`, filter, { headers: this.headers })
      .pipe(map(response => response));
  }

  getInstituteListByUpazilla(
    areaIds: string[] = [],
    pageIndex: number = 1,
    pageSize: number = 100
  ): Observable<RegionLocation[]> {
    const payload = {
      PageNumber: pageIndex,
      LocationIds: areaIds,
    };

    return this.getInstituteByBusinessService(payload).pipe(
      tap(response => {
        console.log('Raw response:', response);
      }),
      map((response: { Result?: { Data?: RegionLocation[][] } }) => {
        return response?.Result?.Data?.flat() || [];
      })
    );
  }

  getInstituteByBusinessService(filter: any): Observable<any> {
    return this.httpClient
      .post<{
        response: any;
      }>(`${this.apiUrl}/GetInstitutes`, filter, { headers: this.headers })
      .pipe(map(response => response));
  }
}
