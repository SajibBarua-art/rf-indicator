import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import {
  PlatformQueryPayload,
  PlatformQueryService,
  TokenManagerService,
} from '@platform-ui/platform-core/services';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { UsageData } from './dashboard.type';
import { IChart } from './dashbord-interface';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private _data: BehaviorSubject<any> = new BehaviorSubject(null);
  private platformQuery = inject(PlatformQueryService);
  private tokenService = inject(TokenManagerService);
  public headers = new HttpHeaders({
    'x-service-id': this.config.ServiceId,
    Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
  });

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    @Inject('config') private config: any
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for data
   */
  get data$(): Observable<any> {
    return this._data.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get data
   */
  getData(): Observable<any> {
    return this._httpClient.get('api/dashboards/project').pipe(
      tap((response: any) => {
        this._data.next(response);
      })
    );
  }

  getStaffData(pageNumber: number): Observable<any> {
    const payload: PlatformQueryPayload = {
      templateId: 'StuffViewQueryTest',
      values: ['', 100, pageNumber],
    };

    return this.platformQuery.getAll(payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getCurrentMonthData(
    currentMonth: number,
    currentYear: number,
    programId: string
  ): Observable<any> {
    const filter = [
      `ProgramId: ${programId}, Year: ${currentYear}, Month: ${currentMonth}`,
      '',
      100,
      0,
    ];
    const payload: PlatformQueryPayload = {
      templateId: 'UsageOfThisMonthQuery',
      values: filter,
      dynamicIndices: [1, 1, 1],
    };

    return this.platformQuery.getAll(payload).pipe(
      map((response: any) => {
        return response as UsageData;
      })
    );
  }
  getTillDateData(programId: string): Observable<any> {
    const payload: PlatformQueryPayload = {
      templateId: 'UsageOfThisMonthQuery',
      values: [`ProgramId: ${programId}`, '', 100, 0],
      dynamicIndices: [1, 1, 1],
    };

    return this.platformQuery.getAll(payload).pipe(
      map((response: any) => {
        return response as UsageData[];
      })
    );
  }
  // apiUrl = 'https://localhost:5001/ProgramBalance';
  public apiUrl = `${this.config.PlatformServices.Sms}/ProgramBalance`;

  getProgramData(id: string): Observable<unknown> {
    return this._httpClient.get<unknown>(`${this.apiUrl}/${id}`, {
      headers: this.headers,
    });
  }

  public getDailySmsAnalyticChart(
    filter: string,
    startDate?,
    endDate?
  ): Observable<any> {
    const filters: string[] = [];
    if (filter) {
      filters.push(`ProgramId:'${filter}'`);
    }
    if (startDate && endDate) {
      filters.push(
        `'Date' : { $gte: ISODate('${startDate}'), $lte: ISODate('${endDate}')}`
      );
    }

    const filterString = `${filters.join(',')}`;

    const payload = [
      {
        templateId: 'DailySmsAnalyticQuery',
        values: [filterString, '', 100, 0],
        dynamicIndices: [1, 1, 1],
      },
    ];

    return this.platformQuery.getAll(payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getDailyApprovalAnalyticChart(
    filter: string,
    startDate?,
    endDate?
  ): Observable<any> {
    const filters: string[] = [];
    if (filter) {
      filters.push(`ProgramId:'${filter}'`);
    }
    if (startDate && endDate) {
      filters.push(
        `'Date' : { $gte: ISODate('${startDate}'), $lte: ISODate('${endDate}')}`
      );
    }

    const filterString = `${filters.join(',')}`;

    const payload = [
      {
        templateId: 'DailyApprovalAnalyticQuery',
        values: [filterString, '', 100, 0],
        dynamicIndices: [1, 1, 1],
      },
    ];

    return this.platformQuery.getAll(payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getDailyCampaignAnalyticChart(
    filter: string,
    startDate?,
    endDate?
  ): Observable<any> {
    const filters: string[] = [];
    if (filter) {
      filters.push(`ProgramId: '${filter}'`);
    }
    if (startDate && endDate) {
      filters.push(
        `'Date' : { $gte: ISODate('${startDate}'), $lte: ISODate('${endDate}')}`
      );
    }

    const filterString = `${filters.join(',')}`;

    const payload = [
      {
        templateId: 'DailyCampaignAnalyticsQuery',
        values: [filterString, '', 100, 0],
        dynamicIndices: [1, 1, 1],
      },
    ];

    return this.platformQuery.getAll(payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getCombinedMonthlyData(
    programId: string,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    const filterString = programId ? `'ProgramId':${programId}` : '';
    const payload: PlatformQueryPayload[] = [
      {
        templateId: 'MonthlyCampaignAnalyticQuery',
        values: [filterString, '+Month', 100, 0],
        dynamicIndices: [1, 1, 1],
      },
      {
        templateId: 'MonthlyApprovalAnalyticQuery',
        values: [filterString, '+Month', 100, 0],
        dynamicIndices: [1, 1, 1],
      },
      {
        templateId: 'MonthlySmsAnalyticQuery',
        values: [filterString, '+Month', 100, 0],
        dynamicIndices: [1, 1, 1],
      },
    ];

    return this.platformQuery.getAll(payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  public getAllapi(programId: string): Observable<any> {
    const payload: PlatformQueryPayload = {
      templateId: 'ApiListQueryCount',
      values: [`ProgramId: '${programId}'`, '', 100, 0],
      dynamicIndices: [1, 1, 1],
    };

    return this.platformQuery.getAll(payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
