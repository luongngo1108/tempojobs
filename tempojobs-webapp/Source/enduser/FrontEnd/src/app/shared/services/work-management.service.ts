import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReturnResult } from '../models/return-result';
import { WorkTypeModel } from '../models/work-type.model';

@Injectable({
  providedIn: 'root'
})
export class WorkManagementService {
  baseUrl = environment.apiWorkManagement;

  constructor(private http: HttpClient) { }

  getAllWorkType(): Observable<ReturnResult<WorkTypeModel[]>> {
    return this.http.get<ReturnResult<WorkTypeModel[]>>(`${this.baseUrl}/getWorkTypes`);
  }
}