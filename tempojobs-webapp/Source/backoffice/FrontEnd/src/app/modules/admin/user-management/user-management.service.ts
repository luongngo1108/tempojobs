import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from "rxjs";
import { GoogleMapLocation, ProfileDetail, User } from "../../shared/models/user.model";
import { environment } from "src/enviroments/enviroment";
import { PagedData } from "../../shared/models/paged-data";
import { ReturnResult } from "../../shared/models/return-result";

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

    getAllUserDetail() {
        return this.httpclient.get<PagedData<User[]>>(`${this.baseUrl}/getAllUserDetail`,);
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

    onDeletes(emails: any = []): Observable<ReturnResult<GoogleMapLocation>> {
        return this.httpclient.post<ReturnResult<GoogleMapLocation>>(`${this.baseUrl}/onDeletes`, emails)
    }
}