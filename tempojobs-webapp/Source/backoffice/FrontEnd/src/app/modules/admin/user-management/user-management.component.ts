import { Component, OnInit, ViewChild } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  columns = [];
  @ViewChild('ngxTableUser', { static: true }) ngxTable: NgxTableComponent;
  addEditComponent = ProfileDialogComponent;
  constructor(
    private userService: UserManagementService,
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {
    this.columns = [
      {
        name: "firstName",
        prop: "firstName"
      },
      {
        name: 'lastName',
        prop: 'lastName'
      },
      {
        name: 'email',
        prop: 'email'
      },
      {
        name: 'phone',
        prop: 'phone'
      },
      {
        name: 'facebook',
        prop: 'facebook'
      },
      {
        name: 'instagram',
        prop: 'instagram'
      },
      {
        name: 'role',
        prop: 'role'
      },
      {
        name: 'address',
        prop: 'googleLocation.address'
      },
      {
        name: 'description',
        prop: 'description'
      }
    ];
    this.refreshData();
    // this.us.getUsers();
  }

  refreshData(reset: boolean = false): void {
    this.userService.getAllUserDetail().subscribe(e => {
      this.ngxTable.setData(e);
    })
  }

  successEventEdit(event: any) {
    if (event) {
      this.messageService.clear();
      this.messageService.add({
        key: 'toast1', severity: 'success', summary: 'Thành công',
        detail: `Thay đổi thông tin cá nhân thành công!`, life: 2000
      });
    }
  }

  successEventAdd(event: any) {
    if (event) {
      this.messageService.clear();
      this.messageService.add({
        key: 'toast1', severity: 'success', summary: 'Thành công',
        detail: `Tạo mới thành công!`, life: 2000
      });
    }
  }

  onClickDelete(event: any) {
    var rowData = event.row;
    this.userService.onDeletes([rowData.email]).subscribe(res => {
      if (res.result) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Thành công',
          detail: `Xoá user thành công!`, life: 2000
        });
        this.refreshData();
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'warn', summary: 'Lỗi',
          detail: `Xoá user không thành công!`, life: 2000
        });
      }
    })
  }
}
