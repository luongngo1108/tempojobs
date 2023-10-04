import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from "rxjs";
import { User } from "./user.model";
import { environment } from "src/environments/environment";
import { PagedData } from "src/app/shared/models/paged-data";

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
}