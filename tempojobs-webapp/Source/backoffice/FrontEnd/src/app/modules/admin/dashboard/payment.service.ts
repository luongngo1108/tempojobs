import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';
import { PagedData } from '../../shared/models/paged-data';
import { PaymentHistory } from './payment-history.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  baseUrl = environment.apiPayment;
  constructor(
    private http: HttpClient
  ) { }

  getAllPayment() {
    return this.http.get<PagedData<PaymentHistory[]>>(`${this.baseUrl}/getAllPayment`);
  }

}
