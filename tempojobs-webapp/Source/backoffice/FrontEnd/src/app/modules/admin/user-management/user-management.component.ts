import { Component, OnInit, ViewChild } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  columns = [];
  @ViewChild('ngxTableUser', {static: true}) ngxTable: NgxTableComponent;
  constructor(
    private userService: UserManagementService
  ) {

  }

  ngOnInit(): void {
    this.columns = [
      {
        name: 'displayName',
        prop: 'displayName' 
      }, 
      { 
        name: 'email',
        prop: 'email' 
      }, 
      { 
        name: 'role',
        prop: 'role' 
      }
    ];
    this.refreshData();
    // this.us.getUsers();
  }

  refreshData(reset: boolean = false): void {
    if(reset) {

    }
    this.userService.getAllUser().subscribe(e => {
      console.log(e);
      this.ngxTable.setData(e);
    })
  }
}
