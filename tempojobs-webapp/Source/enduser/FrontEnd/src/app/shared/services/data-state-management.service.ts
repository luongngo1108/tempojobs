import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReturnResult } from '../models/return-result';
import { DataStateModel } from '../models/data-state.model';

@Injectable({
  providedIn: 'root'
})
export class DataStateManagementService {
  baseUrl = environment.apiDataStateManagement;

  constructor(private http: HttpClient) { }

  getListProvince() {
    return this.http.get<any>(`https://provinces.open-api.vn/api/?depth=2`);
  }

  getDataStateByType(type: string = null) {
    return this.http.get<ReturnResult<DataStateModel[]>>( !type ? `${this.baseUrl}/getDataStateByType` : `${this.baseUrl}/getDataStateByType?type=${type}` );
  }

  getDataStateByTypeAndName(type: string = null, name: string = null) {
    return this.http.get<ReturnResult<DataStateModel>>(`${this.baseUrl}/getDataStateByType?type=${type}&name=${name}` );
  }
}