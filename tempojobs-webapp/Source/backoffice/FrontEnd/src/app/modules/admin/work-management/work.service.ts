import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { PagedData } from '../../shared/models/paged-data';
import { ReturnResult } from '../../shared/models/return-result';
import { WorkModel } from './work.model';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  baseUrl = environment.apiWorkManagement;
  constructor(
    private http: HttpClient
  ) { }

  getAllWork() {
    return this.http.get<ReturnResult<WorkModel[]>>(`${this.baseUrl}/getWorkAll`);
  }

  saveWork(work: WorkModel): Observable<ReturnResult<WorkModel>> {
    return this.http.post<ReturnResult<WorkModel>>(`${this.baseUrl}/saveWork`, work)
  }

  onDeletes(ids: any = []): Observable<ReturnResult<WorkModel>> {
    return this.http.post<ReturnResult<WorkModel>>(`${this.baseUrl}/onDeletes`, ids)
  }
}
