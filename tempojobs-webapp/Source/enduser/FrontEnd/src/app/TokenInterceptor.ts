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
    constructor(public auth: NbAuthService) {
        this.auth.onTokenChange().pipe(takeUntil(this.destroy$))
        .subscribe((token: NbAuthJWTToken) => {
            if(token.isValid()) {
                this.token = token;
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.token}`
            }
        });

        return next.handle(request);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}