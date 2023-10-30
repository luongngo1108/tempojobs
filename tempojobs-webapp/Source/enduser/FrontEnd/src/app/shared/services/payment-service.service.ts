import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReturnResult } from '../models/return-result';
import { Observable } from 'rxjs';
import { PaymentHistory } from '../models/payment-history.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
  baseUrl = environment.apiPayment;

  constructor(private http: HttpClient) { }

  createMomoPayment(obj: any): Observable<ReturnResult<string>> {
    return this.http.post<ReturnResult<string>>(`${this.baseUrl}/createMomoPayment`, obj);
  }

  momoPayementSuccess(obj: any): Observable<ReturnResult<boolean>> {
    return this.http.post<ReturnResult<boolean>>(`${this.baseUrl}/momoPayementSuccess`, obj);
  }

  getPaymentHistoryByUserId(userId: string): Observable<ReturnResult<PaymentHistory[]>> {
    return this.http.get<ReturnResult<PaymentHistory[]>>(`${this.baseUrl}/getPaymentHistoryByUserId/${userId}`);
  }
}
