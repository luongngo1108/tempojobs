import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReturnResult } from '../models/return-result';
import { WorkModel } from '../models/work.model';

@Injectable({
  providedIn: 'root'
})
export class WorkManagementService {
  baseUrl = environment.apiWorkManagement;

  constructor(private http: HttpClient) { }

  getAllWork(): Observable<ReturnResult<WorkModel[]>> {
    return this.http.get<ReturnResult<WorkModel[]>>(`${this.baseUrl}/getWorkAll`);
  }

  saveWork(model: WorkModel): Observable<ReturnResult<WorkModel>> {
    return this.http.post<ReturnResult<WorkModel>>(`${this.baseUrl}/saveWork`, model);
  }
}