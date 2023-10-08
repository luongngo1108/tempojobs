import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { UserManagementService } from "./profile/user-management.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy { 
    userLogined: any;
    private destroy$: Subject<void> = new Subject<void>();

    constructor (
        private userService: UserManagementService,
    ) {
        this.userService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(resp => {
            if (resp) this.userLogined = resp;
        });
    }

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}