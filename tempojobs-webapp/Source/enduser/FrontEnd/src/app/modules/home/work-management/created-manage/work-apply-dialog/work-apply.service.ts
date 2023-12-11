import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReturnResult } from 'src/app/shared/models/return-result';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkApply, WorkApplyViewModel } from '../../work-detail/appy-work/work-appy.model';

@Injectable({
  providedIn: 'root'
})
export class WorkApplyService {
  baseUrl = environment.apiWorkManagement;
  constructor(private http: HttpClient) { }

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

  deleteWorkApplyNotSendNoti(model: WorkApply): Observable<ReturnResult<WorkApply>> {
    return this.http.post<ReturnResult<WorkApply>>(`${this.baseUrl}/deleteWorkApplyNotSendNoti`, model);
  }

  getAllWorkApplyByUserId(userId: string): Observable<ReturnResult<WorkApply[]>> {
    return this.http.get<ReturnResult<WorkApply[]>>(`${this.baseUrl}/getAllWorkApplyByUserId/${userId}`);
  }

  getAllWorkApplByWorkId(workId: number): Observable<ReturnResult<WorkApplyViewModel[]>> {
    return this.http.get<ReturnResult<WorkApplyViewModel[]>>(`${this.baseUrl}/getAllWorkApplyByWorkId/${workId}`);
  }
}
