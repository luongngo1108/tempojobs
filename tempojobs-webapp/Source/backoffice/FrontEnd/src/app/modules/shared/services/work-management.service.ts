import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReturnResult } from '../models/return-result';
import { Page } from '../models/page';
import { PagedData } from '../models/paged-data';
import { environment } from 'src/enviroments/enviroment';
import { WorkModel } from '../../admin/work-management/work.model';
import { WorkApply } from '../../admin/work-management/work-apply-management/work-apply.model';

@Injectable({
  providedIn: 'root'
})
export class WorkManagementService {
  baseUrl = environment.apiWorkManagement;

  constructor(private http: HttpClient) { }

  getAllWork(): Observable<ReturnResult<WorkModel[]>> {
    return this.http.get<ReturnResult<WorkModel[]>>(`${this.baseUrl}/getWorkAll`);
  }

  getWorkByCreatorId(id: string): Observable<ReturnResult<WorkModel[]>> {
    return this.http.get<ReturnResult<WorkModel[]>>(`${this.baseUrl}/getWorkByCreatorId?id=${id}`);
  }

  getWorkPaging(page: Page): Observable<ReturnResult<PagedData<WorkModel>>> {
    return this.http.post<ReturnResult<PagedData<WorkModel>>>(`${this.baseUrl}/getWorkPaging`, page);
  }

  saveWork(model: WorkModel): Observable<ReturnResult<WorkModel>> {
    return this.http.post<ReturnResult<WorkModel>>(`${this.baseUrl}/saveWork`, model);
  }

  deleteWork(id: number): Observable<ReturnResult<boolean>> {
    return this.http.delete<ReturnResult<boolean>>(`${this.baseUrl}/${id}`);
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

  changeWorkStatus(statusId: string, workId: number): Observable<ReturnResult<WorkModel>> {
    return this.http.post<ReturnResult<WorkModel>>(`${this.baseUrl}/changeWorkStatus`, {statusId: statusId, workId: workId});
  }
}