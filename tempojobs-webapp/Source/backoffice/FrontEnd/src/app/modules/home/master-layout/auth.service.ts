import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from "rxjs";
import { ReturnResult } from "../../shared/models/return-result";
import { environment } from "src/enviroments/enviroment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl = environment.apiAuth;
    constructor(private httpclient: HttpClient) {}

    sendEmailChangePassword(email: string): Observable<ReturnResult<string>> {
        return this.httpclient.post<ReturnResult<string>>(`${this.baseUrl}/sendEmailResetPassword`, {email: email});
    } 

    resetPassword(password: string, userId: string, token: string): Observable<ReturnResult<string>> {
        return this.httpclient.post<ReturnResult<string>>(`${this.baseUrl}/resetPassword/${userId}/${token}`, {password: password});
    } 
}