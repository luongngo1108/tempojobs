import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy { 
    userLogined: boolean = false;
    private destroy$: Subject<void> = new Subject<void>();

    constructor () {
        if (this.userLogined === false) {
            this.userLogined = true;
            console.log(this.userLogined);
        }
    }

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {
        
    }
}