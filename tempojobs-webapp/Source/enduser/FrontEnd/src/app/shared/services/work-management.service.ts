import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReturnResult } from '../models/return-result';
import { WorkModel } from '../models/work.model';
import { Page } from '../models/page';
import { PagedData } from '../models/paged-data';
import { WorkApply } from 'src/app/modules/home/work-management/work-detail/appy-work/work-appy.model';

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
}