import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ReturnResult } from 'src/app/shared/models/return-result';
import { Report } from './report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.apiReport;
  constructor(
    private http: HttpClient
  ) { }

  saveReport(model: Report): Observable<ReturnResult<string>> {
    return this.http.post<ReturnResult<string>>(`${this.baseUrl}/saveReport`, model);
  }
}
