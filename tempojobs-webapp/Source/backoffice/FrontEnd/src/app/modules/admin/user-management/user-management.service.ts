import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/enviroments/enviroment";
import { Subject, Observable } from "rxjs";
import { User } from "./user.model";
import { PagedData } from "../../shared/models/paged-data";

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {
    constructor(private httpclient: HttpClient) {}
    baseUrl = environment.apiUser;
    _userList = new Subject<User[]>
    getAllUser() {
        return this.httpclient.get(`${this.baseUrl}/get`).subscribe((resp:any) => {
            if(resp != null) {
                this._userList.next(resp);
            }
        })
    }
    getAllUser2() {
        return this.httpclient.get<PagedData<User[]>>(`${this.baseUrl}/get`,);
    }

    getUserList(): Observable<User[]> {
        return this._userList.asObservable();
    }
}