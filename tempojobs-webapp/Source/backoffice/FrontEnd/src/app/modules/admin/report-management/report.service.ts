import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { PagedData } from '../../shared/models/paged-data';
import { ReturnResult } from '../../shared/models/return-result';
import { Report } from './report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.apiReport;
  constructor(
    private http: HttpClient
  ) { }

  getAllReport() {
    return this.http.get<PagedData<Report[]>>(`${this.baseUrl}/getAllReport`);
  }

  saveReport(report: Report): Observable<ReturnResult<Report>> {
    return this.http.post<ReturnResult<Report>>(`${this.baseUrl}/saveReport`, report)
  }

  onDeletes(ids: any = []): Observable<ReturnResult<Report>> {
    return this.http.post<ReturnResult<Report>>(`${this.baseUrl}/onDeletes`, ids)
  }
}
