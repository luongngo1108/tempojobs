import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { PagedData } from '../../shared/models/paged-data';
import { ReturnResult } from '../../shared/models/return-result';
import { WorkApply } from './work-apply-management/work-apply.model';
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

  getWorkByWorkId(workId: number): Observable<ReturnResult<WorkModel>> {
    return this.http.get<ReturnResult<WorkModel>>(`${this.baseUrl}/getWorkByWorkId/${workId}`);
  }

  applyForWork(workApplyModel: WorkApply, userId: string): Observable<ReturnResult<WorkModel>> {
    return this.http.post<ReturnResult<WorkModel>>(`${this.baseUrl}/applyForWork?id=${userId}`, workApplyModel);
  }

  getWorkApplyById(id: string): Observable<ReturnResult<WorkApply>> {
    return this.http.get<ReturnResult<WorkApply>>(`${this.baseUrl}/getWorkApplyById?id=${id}`);
  }

  getWorkApplyByWorkIdAndUserId(workId: number, userId: string): Observable<ReturnResult<WorkApply>> {
    return this.http.get<ReturnResult<WorkApply>>(`${this.baseUrl}/getWorkApplyByWorkIdAndUserId?workId=${workId}&userId=${userId}`);
  }

  saveWorkApply(model: WorkApply): Observable<ReturnResult<WorkApply>> {
    return this.http.post<ReturnResult<WorkApply>>(`${this.baseUrl}/saveWorkApply`, model);
  }

  deleteWorkApply(model: WorkApply): Observable<ReturnResult<WorkApply>> {
    return this.http.post<ReturnResult<WorkApply>>(`${this.baseUrl}/deleteWorkApply`, model);
  }

  getAllWorkApplyByUserId(userId: string): Observable<ReturnResult<WorkApply[]>> {
    return this.http.get<ReturnResult<WorkApply[]>>(`${this.baseUrl}/getAllWorkApplyByUserId/${userId}`);
  }
}
