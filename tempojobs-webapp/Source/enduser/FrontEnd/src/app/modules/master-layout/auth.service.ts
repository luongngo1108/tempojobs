import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PagedData } from "src/app/shared/models/paged-data";
import { ReturnResult } from "src/app/shared/models/return-result";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpclient: HttpClient) {}
    baseUrl = environment.apiAuth;

    sendEmailChangePassword(email: string): Observable<ReturnResult<string>> {
        return this.httpclient.post<ReturnResult<string>>(`${this.baseUrl}/sendEmailResetPassword`, {email: email});
    } 

    resetPassword(password: string, userId: string, token: string): Observable<ReturnResult<string>> {
        return this.httpclient.post<ReturnResult<string>>(`${this.baseUrl}/resetPassword/${userId}/${token}`, {password: password});
    } 
}