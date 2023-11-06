import { Injectable, OnDestroy } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Observable, Subject, takeUntil } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    token: any;
    urlsToNotUse: Array<string>;
    constructor(public auth: NbAuthService) {
        this.auth.onTokenChange().pipe(takeUntil(this.destroy$))
        .subscribe((token: NbAuthJWTToken) => {
            if(token.isValid()) {
                this.token = token;
            }
        });

        // this.urlsToNotUse= [
        //     'myController1/myAction1/.+',
        //     'myController1/myAction2/.+',
        //     'https://provinces.open-api.vn/api/?depth=2'
        // ];
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.url !== 'https://provinces.open-api.vn/api/?depth=2') {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.token}`
                }
            });
        }

        return next.handle(request);
    }

    // private isValidRequestForInterceptor(requestUrl: string): boolean {
    //     let positionIndicator: string = 'api/';
    //     let position = requestUrl.indexOf(positionIndicator);
    //     if (position > 0) {
    //       let destination: string = requestUrl.substr(position + positionIndicator.length);
    //       for (let address of this.urlsToNotUse) {
    //         if (new RegExp(address).test(destination)) {
    //           return false;
    //         }
    //       }
    //     }
    //     return true;
    // }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}