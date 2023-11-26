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
  getListProvince() {
    return this.http.get<any>(`https://provinces.open-api.vn/api/?depth=2`);
  }

  getAllDataState() {
    return this.http.get<PagedData<DataStateModel[]>>(`${this.baseUrl}/getDataStateAll`);
  }

  saveDataState(dataState: DataStateModel): Observable<ReturnResult<DataStateModel>> {
    return this.http.post<ReturnResult<DataStateModel>>(`${this.baseUrl}/saveDataState`, dataState)
  }

  onDeletes(ids: any = []): Observable<ReturnResult<DataStateModel>> {
    return this.http.post<ReturnResult<DataStateModel>>(`${this.baseUrl}/onDeletes`, ids)
  }

  getDataStateByType(type: string = null) {
    return this.http.get<ReturnResult<DataStateModel[]>>( !type ? `${this.baseUrl}/getDataStateByType` : `${this.baseUrl}/getDataStateByType?type=${type}` );
  }

  getDataStateByTypeAndName(type: string = null, name: string = null) {
    return this.http.get<ReturnResult<DataStateModel>>(`${this.baseUrl}/getDataStateByTypeAndName?type=${type}&name=${name}` );
  }
}
