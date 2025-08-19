import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenManagerService } from '@platform-ui/platform-core/services';

@Injectable({
  providedIn: 'root',
})
export class WalletLoginService {
  constructor(
    @Inject('config') private config: any,
    private http: HttpClient,
    private tokenManagerService: TokenManagerService
  ) {}

  getAccessToken(): Observable<any> {
    return this.http
      .get(this.config?.PlatformServices?.TokenService + '/GetToken', {})
      .pipe(
        catchError(error => {
          console.error('Error renewing access token', error);
          return of(null);
        })
      );
  }

  renewAccessToken(): Observable<any> {
    return this.getAccessToken().pipe(
      tap((result: any) => {
        this.tokenManagerService.setAccessToken(result.access_token);
      }),
      catchError(error => {
        console.error('Error renewing access token', error);
        return of(null);
      })
    );
  }
}
