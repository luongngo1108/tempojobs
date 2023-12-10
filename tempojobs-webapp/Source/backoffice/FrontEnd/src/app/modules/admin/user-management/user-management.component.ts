import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { MessageService } from 'primeng/api';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy{
  columns = [];
  @ViewChild('ngxTableUser', { static: true }) ngxTable: NgxTableComponent;
  @ViewChild('showRating', { static: true }) showRating: TemplateRef<any>;
  addEditComponent = ProfileDialogComponent;
  private destroy$: Subject<void> = new Subject<void>();
  user: any = {};
  constructor(
    private userService: UserManagementService,
    private messageService: MessageService,
    private authService: NbAuthService
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
    .subscribe(async (token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 

      }
    });

  }

  ngOnInit(): void {
    this.columns = [
      {
        name: "rating",
        prop: "",
        cellTemplate: this.showRating,
      },
      {
        name: "firstName",
        prop: "firstName"
      },
      {
        name: 'lastName',
        prop: 'lastName'
      },
      {
        name: 'Gender',
        prop: 'sex'
      },
      {
        name: 'birthday',
        prop: 'birth'
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
    this.userService.getAllUserDetail(this.user.user.email).subscribe(e => {
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

  onClickDeletes(event: any) {
    var deteleItem = this.ngxTable.selected;
    var deleteEmails = deteleItem.map(x => x.email);
    this.userService.onDeletes(deleteEmails).subscribe(res => {
      if (res.result) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Thành công',
          detail: `Xoá ${this.ngxTable.selected.length} user thành công!`, life: 2000
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
