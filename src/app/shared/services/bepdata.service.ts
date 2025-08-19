import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenManagerService } from '@platform-ui/platform-core/services';
import { map, Observable } from 'rxjs';
import { BepClass, BepSubject } from '../data/type/bep.type';

@Injectable({
  providedIn: 'root',
})
export class BepdataService {
  private readonly httpClient = inject(HttpClient);
  private readonly tokenService = inject(TokenManagerService);
  public apiUrl = `${this.config.BusinessServices.BepData}/ExternalAcademicInfo/Classes`;

  constructor(@Inject('config') private readonly config: typeof environment) {}

  public headers = new HttpHeaders({
    'x-service-id': this.config.ServiceId,
    Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
  });

  getClasses(): Observable<BepClass[]> {
    return this.httpClient
      .get<{
        Result: { Classes: BepClass[] };
      }>(`${this.apiUrl}`, { headers: this.headers })
      .pipe(map(response => response.Result.Classes));
  }

  getSubjects(classId: string): Observable<BepSubject[]> {
    return this.httpClient
      .get<{ Result: { Subjects: BepSubject[] } }>(
        `${this.apiUrl}/${classId}`,
        {
          headers: this.headers,
        }
      )
      .pipe(map(response => response.Result.Subjects));
  }
}
