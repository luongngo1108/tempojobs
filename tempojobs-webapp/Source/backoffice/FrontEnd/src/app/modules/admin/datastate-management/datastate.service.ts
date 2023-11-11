import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { PagedData } from '../../shared/models/paged-data';
import { ReturnResult } from '../../shared/models/return-result';
import { DataStateModel } from './data-state.model';

@Injectable({
  providedIn: 'root'
})
export class DatastateService {
  baseUrl = environment.apiDataStateManagement;
  constructor(
    private http: HttpClient
  ) { }

  getAllDataState() {
    return this.http.get<PagedData<DataStateModel[]>>(`${this.baseUrl}/getDataStateAll`);
  }

  saveDataState(dataState: DataStateModel): Observable<ReturnResult<DataStateModel>> {
    return this.http.post<ReturnResult<DataStateModel>>(`${this.baseUrl}/saveDataState`, dataState)
  }

  onDeletes(ids: any = []): Observable<ReturnResult<DataStateModel>> {
    return this.http.post<ReturnResult<DataStateModel>>(`${this.baseUrl}/onDeletes`, ids)
  }
}
