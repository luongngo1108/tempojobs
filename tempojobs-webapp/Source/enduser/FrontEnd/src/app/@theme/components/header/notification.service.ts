import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ReturnResult } from 'src/app/shared/models/return-result';
import { Notification } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  baseUrl = environment.apiNotification;
  constructor(
    private http: HttpClient
  ) { }

  getNotificationByUserId(userId: number, pageNumber: number): Observable<ReturnResult<Notification[]>> {
    return this.http.post<ReturnResult<Notification[]>>(`${this.baseUrl}/getNotificationByUserId/${userId}`, {pageNumber: pageNumber});
  }
  saveNotifcation(userId: number ,notification: Notification): Observable<ReturnResult<Notification[]>> {
    return this.http.post<ReturnResult<Notification[]>>(`${this.baseUrl}/saveNotifcation/${userId}`, notification);
  }
  markAllAsRead(userId: number): Observable<ReturnResult<Notification[]>> {
    return this.http.get<ReturnResult<Notification[]>>(`${this.baseUrl}/markAllAsRead/${userId} `);
  }
}
