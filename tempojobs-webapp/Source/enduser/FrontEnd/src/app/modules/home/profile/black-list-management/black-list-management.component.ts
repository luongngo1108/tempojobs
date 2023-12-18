import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DataStateModel } from 'src/app/shared/models/data-state.model';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkApplyViewModel } from '../../work-management/work-detail/appy-work/work-appy.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WorkApplyService } from '../../work-management/created-manage/work-apply-dialog/work-apply.service';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { MessageService } from 'primeng/api';
import { UserManagementService } from '../user-management.service';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { ReplaySubject, Subject, debounceTime, distinctUntilChanged, lastValueFrom, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { User } from '../user.model';

@Component({
  selector: 'app-black-list-management',
  templateUrl: './black-list-management.component.html',
  styleUrls: ['./black-list-management.component.scss']
})
export class BlackListManagementComponent implements OnInit, OnDestroy, AfterViewInit {
  workModel: WorkModel;
  listWorkApplyViewModel: WorkApplyViewModel[] = [];
  listWorkApplyStatus: DataStateModel[] = [];
  destroy$: Subject<void> = new Subject<void>();
  user: any;

  // Add user
  selectedUser: any;
  listUser: any[] = [];
  public userBankFilterCtrl: FormControl = new FormControl();
  public userFilteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  listBlockedUser: User[] = [];

  constructor(
    private workApplyService: WorkApplyService,
    private dataStateService: DataStateManagementService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private userService: UserManagementService,
    private workService: WorkManagementService,
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
    this.refreshData();
  }

  async refreshData() {
    this.selectedUser ="";
    var getBlockedRes = await lastValueFrom(this.userService.getBlockedUserByUserId(this.user.user.id));
    if (getBlockedRes.result) {
      this.listBlockedUser = getBlockedRes.result;
    }

    this.userService.getAllUserExceptEmailAndAdmin(this.user.user.email).subscribe(e => {
      this.listUser = e.data;
      this.listUser = this.listUser.filter((user) => {
        return (
          this.listBlockedUser.filter(x => x._id == user._id).length === 0
        );
      })
      this.userFilteredBanks.next(this.listUser);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.userBankFilterCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe(() => {
        this.userfilterBanks();
      });
  }

  protected userfilterBanks() {
    if (!this.listUser) {
      return;
    }

    let search = this.userBankFilterCtrl.value;
    if (!search) {
      this.userFilteredBanks.next(this.listUser.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.userFilteredBanks.next(
      this.listUser.filter((user) => {
        const searchLowerCase = search.toLowerCase();
        return (
          (user?.displayName?.toLowerCase()?.trim()?.indexOf(searchLowerCase) > -1 ||
            user?.email?.toLowerCase()?.trim()?.indexOf(searchLowerCase) > -1) &&
          this.listBlockedUser.filter(x => x._id == user._id).length === 0
        );
      })
    );
  }

  blockUser() {
    if (this.selectedUser) {
      this.userService.blockUser(this.user.user.id, this.selectedUser).subscribe(async res => {
        if (res.result) {
          this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'success', summary: 'Thành công',
            detail: `Đã chặn user thành công!`, life: 3000
          });
          this.refreshData();
        }
      });
    }
  }

  unBlockUser(userId: string) {
    if (userId) {
      this.userService.unBlockUser(this.user.user.id, userId).subscribe(async res => {
        if (res.result) {
          this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'success', summary: 'Thành công',
            detail: `Đã bỏ chặn user thành công!`, life: 3000
          });
          this.refreshData();
        }
      });
    }
  }

}
