import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from "rxjs";
import { ProfileDetail, User } from "./user.model";
import { environment } from "src/environments/environment";
import { PagedData } from "src/app/shared/models/paged-data";
import { ReturnResult } from "src/app/shared/models/return-result";

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {
    constructor(private httpclient: HttpClient) {}
    baseUrl = environment.apiUser;
    _currentUser = new Subject<any>;
    _userList = new Subject<User[]>
    setUserList() {
        return this.httpclient.get(`${this.baseUrl}/get`).subscribe((resp:any) => {
            if(resp != null) {
                this._userList.next(resp);
            }
        })
    }
    
    getUserList(): Observable<User[]> {
        return this._userList.asObservable();
    }

    getAllUser() {
        return this.httpclient.get<PagedData<User[]>>(`${this.baseUrl}/get`,);
    }

    getCurrentUser(): Observable<any> {
       return this._currentUser.asObservable();
    }

    getUserDetailById(id: string): Observable<ReturnResult<ProfileDetail>> {
        return this.httpclient.get<ReturnResult<ProfileDetail>>(`${this.baseUrl}/getUserDetailById?id=${id}`);
    } 

    saveProfileDetail(profileDetail: ProfileDetail): Observable<ReturnResult<ProfileDetail>> {
        return this.httpclient.post<ReturnResult<ProfileDetail>>(`${this.baseUrl}/saveUserDetail`, profileDetail)
    }
}