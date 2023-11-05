import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from "rxjs";
import { GoogleMapLocation, ProfileDetail, User } from "./user.model";
import { environment } from "src/environments/environment";
import { PagedData } from "src/app/shared/models/paged-data";
import { ReturnResult } from "src/app/shared/models/return-result";

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {
    constructor(private httpclient: HttpClient) {}
    baseUrl = environment.apiUser;
    locationUrl = environment.apiLocation;
    _currentUser = new Subject<any>;
    _currentUserDetail = new Subject<ProfileDetail>;
    _userList = new Subject<User[]>
    setUserList() {
        return this.httpclient.get(`${this.baseUrl}/get`).subscribe((resp:any) => {
            if(resp != null) {
                this._userList.next(resp);
            }
        })
    }

    getCurrentUserDetail(): Observable<ProfileDetail> {
        return this._currentUserDetail.asObservable();
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
    
    getUserDetailByUserId(id: string): Observable<ReturnResult<ProfileDetail>> {
        return this.httpclient.get<ReturnResult<ProfileDetail>>(`${this.baseUrl}/getUserDetailByUserId?id=${id}`);
    }

    saveProfileDetail(profileDetail: ProfileDetail): Observable<ReturnResult<ProfileDetail>> {
        return this.httpclient.post<ReturnResult<ProfileDetail>>(`${this.baseUrl}/saveUserDetail`, profileDetail)
    }

    saveGoogleMapLocation(googleLocation: GoogleMapLocation): Observable<ReturnResult<GoogleMapLocation>> {
        return this.httpclient.post<ReturnResult<GoogleMapLocation>>(`${this.locationUrl}/saveGoogleMapLocation`, googleLocation)
    }

    getUserById(id: string): Observable<ReturnResult<User>> {
        return this.httpclient.get<ReturnResult<User>>(`${this.baseUrl}/getUserById?id=${id}`);
    }
}