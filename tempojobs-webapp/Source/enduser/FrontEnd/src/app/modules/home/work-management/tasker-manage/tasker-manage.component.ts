import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WorkModel } from 'src/app/shared/models/work.model';
import { ActivatedRoute } from '@angular/router';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { DataStateModel } from 'src/app/shared/models/data-state.model';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentServiceService } from 'src/app/shared/services/payment-service.service';
import { Location } from '@angular/common';
import { UserManagementService } from '../../profile/user-management.service';
import { ProfileDetail, User } from '../../profile/user.model';
import { MessageService } from 'primeng/api';
import { ApproveTaskerDialogComponent } from '../created-manage/approve-tasker-dialog/approve-tasker-dialog.component';
import { AppyWorkComponent } from '../work-detail/appy-work/appy-work.component';
import { WorkApply } from '../work-detail/appy-work/work-appy.model';

@Component({
  selector: 'app-tasker-manage',
  templateUrl: './tasker-manage.component.html',
  styleUrls: ['./tasker-manage.component.scss']
})
export class TaskerManageComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumnsTab1: string[] = ['workName', 'totalProfile', 'timeLine', 'workStatusName', 'moreAction'];
  displayedColumnsTab2: string[] = ['workName', 'workApplyStatus', 'moreAction'];
  displayedColumnsTab3: string[] = ['workName', 'workTime', 'candidateApproval', 'workProfit'];
  displayedColumnsTab4: string[] = ['workName', 'candidateApproval', 'confirm'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  listWorkApply: WorkApply[] = [];

  listWorkShow: WorkModel[] = [];
  listWorkType: DataStateModel[] = [];
  listWorkStatus: DataStateModel[] = [];
  listWorkApplyStatus: DataStateModel[] = [];
  approvingId: number;
  approvedId: number;
  refuseApprovalId: number;
  processingId: number;
  evaluationId: number;
  doneId: number;
  currentUser;
  countTab1: number;
  countTab2: number;
  countTab3: number;
  countTab4: number;
  paymentToken = null;
  paymentMessage = null;
  amount = null;
  userId = null;
  waitingApplyId: number;
  refusedApplyId: number;
  acceptApplyId: number;
  savingApplyId: number;
  evaluatingApplyId: number;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private workService: WorkManagementService,
    private dataStateService: DataStateManagementService,
    private authService: NbAuthService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private paymentService: PaymentServiceService,
    private _location: Location,
    private userService: UserManagementService,
    private messageService: MessageService
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$)).subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.currentUser = token.getPayload();
      }
    });
  }

  async ngOnInit() {
    await this.getDataDefaults();
    await this.refreshData();
  }

  async getDataDefaults() {
    var resultStatus = await this.dataStateService.getDataStateByType("WORK_STATUS").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultStatus.result) {
      this.listWorkStatus = resultStatus.result;
      this.approvingId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Đang duyệt').dataStateId;
      this.approvedId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Đã duyệt').dataStateId;
      this.refuseApprovalId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Từ chối duyệt').dataStateId;
      this.processingId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Đang thực hiện')?.dataStateId;
      this.evaluationId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Chờ đánh giá')?.dataStateId;
      this.doneId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Hoàn thành')?.dataStateId;
    }
    var resultType = await this.dataStateService.getDataStateByType("WORK_TYPE").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultType.result) {
      this.listWorkType = resultType.result;
    }
    var resultApply = await this.dataStateService.getDataStateByType("WORK_APPLY_STATUS").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultApply.result) {
      this.listWorkApplyStatus = resultApply.result;
      this.savingApplyId = this.listWorkApplyStatus.find(workApplyStatus => workApplyStatus.dataStateName === 'Đang lưu').dataStateId;
      this.waitingApplyId = this.listWorkApplyStatus.find(workApplyStatus => workApplyStatus.dataStateName === 'Đang đăng ký').dataStateId;
      this.acceptApplyId = this.listWorkApplyStatus.find(workApplyStatus => workApplyStatus.dataStateName === 'Được nhận').dataStateId;
      this.refusedApplyId = this.listWorkApplyStatus.find(workApplyStatus => workApplyStatus.dataStateName === 'Bị từ chối').dataStateId;
      this.evaluatingApplyId = this.listWorkApplyStatus.find(workApplyStatus => workApplyStatus.dataStateName === 'Đã đánh giá').dataStateId;
    }
  }

  async getListWorkApplyDefaults() {
    var respWorkApply = await this.workService.getAllWorkApplyByUserId(this.currentUser?.user?.id).pipe(takeUntil(this.destroy$)).toPromise();
    if (respWorkApply.result) {
      this.listWorkApply = respWorkApply.result;
      this.listWorkApply.map(async workApply => {
        var respWork = await this.workService.getWorkByWorkId(workApply.workId).pipe(takeUntil(this.destroy$)).toPromise();
        if (respWork.result) {
          this.listWorkShow.push(respWork.result);
        }
        this.counterTab();
        this.changeTabWithNumber(1);
      });
    }
    this.listWorkShow.map(work => work.timeLine = this.getTimeLine(work?.createdAt));
  }

  counterTab() {
    this.countTab1 = null;
    this.countTab2 = null;
    this.countTab3 = null;
    this.countTab4 = null;
    const filterTab1 = this.listWorkApply.filter(workApply => workApply.status === this.savingApplyId);
    if (filterTab1.length > 0) {
      this.countTab1 = filterTab1.length;
    }
    const filterTab2 = this.listWorkApply.filter(workApply => workApply.status === this.waitingApplyId || workApply.status === this.acceptApplyId);
    if (filterTab2.length > 0) {
      this.countTab2 = filterTab2.length;
    }
    const filterTab3 = this.listWorkShow.filter(workApply => workApply.workStatusId === this.processingId);
    if (filterTab3.length > 0) {
      this.countTab3 = filterTab3.length;
    }
    const filterTab4 = this.listWorkShow.filter(workApply => workApply.workStatusId === this.evaluationId);
    if (filterTab4.length > 0) {
      this.countTab4 = filterTab4.length;
    }
  }

  async refreshData() {
    await this.getListWorkApplyDefaults();
    this.counterTab();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTab(event) {
    this.listWorkShow = [];
    switch (Number(event.tabId)) {
      case 1:
        this.listWorkApply.map(async workApply => {
          if (workApply.status === this.savingApplyId) {
            var respWork = await this.workService.getWorkByWorkId(workApply.workId).pipe(takeUntil(this.destroy$)).toPromise();
            if (respWork.result) {
              this.listWorkShow.push(respWork.result);
            }
          }
        });
        break;
      case 2:
        this.listWorkApply.map(async workApply => {
          if (workApply.status === this.waitingApplyId || workApply.status === this.refusedApplyId || workApply.status === this.acceptApplyId) {
            var respWork = await this.workService.getWorkByWorkId(workApply.workId).pipe(takeUntil(this.destroy$)).toPromise();
            if (respWork.result && respWork.result.workStatusId === this.approvedId) {
              this.listWorkShow.push(respWork.result);
            }
          }
        });
        break;
      case 3:
        this.listWorkApply.map(async workApply => {
          if (workApply.status === this.acceptApplyId) {
            var respWork = await lastValueFrom(this.workService.getWorkByWorkId(workApply.workId));
            if (respWork.result && respWork.result?.workStatusId === this.processingId) {
              if (respWork.result?.workApply && respWork.result?.workApply?.length > 0) {
                respWork.result.listTaskerAccepted = [];
                respWork.result?.workApply.map(async workApplyId => {
                  var respWorkApply = await lastValueFrom(this.workService.getWorkApplyById(workApplyId));
                  if (respWorkApply.result && respWorkApply.result?.status === this.acceptApplyId) {
                    var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                    if(resp.result) {
                      respWork.result.listTaskerAccepted.push(resp.result);
                    }
                  }
                })
              }
              this.listWorkShow.push(respWork.result);
            }
          }
        });
        break;
      case 4:
        this.listWorkApply.map(async workApply => {
          if (workApply.status === this.acceptApplyId || workApply.status === this.evaluatingApplyId) {
            var respWork = await this.workService.getWorkByWorkId(workApply.workId).pipe(takeUntil(this.destroy$)).toPromise();
            if (respWork.result && respWork.result.workStatusId === this.evaluationId) {
              this.listWorkShow.push(respWork.result);
            }
          }
        });
        break;
    }
    this.listWorkShow.map(work => work.timeLine = this.getTimeLine(work?.createdAt));
  }

  changeTabWithNumber(data: number) {
    this.listWorkShow = [];
    switch (data) {
      case 1:
        this.listWorkApply.map(async workApply => {
          if (workApply.status === this.savingApplyId) {
            var respWork = await this.workService.getWorkByWorkId(workApply.workId).pipe(takeUntil(this.destroy$)).toPromise();
            if (respWork.result) {
              this.listWorkShow.push(respWork.result);
            }
          }
        });
        break;
      case 2:
        this.listWorkApply.map(async workApply => {
          if (workApply.status === this.waitingApplyId || workApply.status === this.refusedApplyId || workApply.status === this.acceptApplyId) {
            var respWork = await this.workService.getWorkByWorkId(workApply.workId).pipe(takeUntil(this.destroy$)).toPromise();
            if (respWork.result) {
              this.listWorkShow.push(respWork.result);
            }
          }
        });
        break;
      case 3:
        this.listWorkApply.map(async workApply => {
          if (workApply.status === this.acceptApplyId) {
            var respWork = await this.workService.getWorkByWorkId(workApply.workId).pipe(takeUntil(this.destroy$)).toPromise();
            if (respWork.result) {
              this.listWorkShow.push(respWork.result);
            }
          }
        });
        this.listWorkShow.map(work => {
          if (work.workApply && work.workApply.length > 0) {
            work.listTaskerAccepted = [];
            work.workApply.map(async workApplyId => {
              var respWorkApply = await lastValueFrom(this.workService.getWorkApplyById(workApplyId));
              if (respWorkApply.result && respWorkApply.result.status === this.acceptApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if(resp.result) {
                  work.listTaskerAccepted.push(resp.result);
                }
              }
            })
          }
        });
        break;
      case 4:
        this.listWorkApply.map(async workApply => {
          if (workApply.status === this.acceptApplyId || workApply.status === this.evaluatingApplyId) {
            var respWork = await this.workService.getWorkByWorkId(workApply.workId).pipe(takeUntil(this.destroy$)).toPromise();
            if (respWork.result && respWork.result.workStatusId === this.evaluationId) {
              this.listWorkShow.push(respWork.result);
            }
          }
        });
        break;
    }
    this.listWorkShow.map(work => work.timeLine = this.getTimeLine(work?.createdAt));
  }

  async createPayment(workModel: any) {
    var startDate = new Date(workModel.startDate);
    var createdAt = new Date(workModel.createdAt);
    const diffTime = Math.abs(Number(startDate) - Number(createdAt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    var amount = diffDays * 5000 + workModel.quantity * 1000;
    var respCreatePayment = await lastValueFrom(this.paymentService.createMomoPayment({
      userEmail: workModel.createdBy.email, inputAmount: amount, workId: workModel.workId
    }));
    if (respCreatePayment.result) window.location.href = respCreatePayment.result;
  }

  handleDisplayStatus(state: number, isDisplayColor: boolean = false): string {
    if (this.listWorkStatus?.length <= 0) {
      return isDisplayColor ? '#0000' : '';
    }
    if (state) {
      if (isDisplayColor) {
        var findColor = this.listWorkStatus.find(x => x.dataStateId === state);
        if (findColor) return findColor.colorCode;
        else return '#0000';
      }
      else {
        var findName = this.listWorkStatus.find(x => x.dataStateId === state);
        if (findName) return findName.dataStateName;
        else return '';
      }
    }
  }

  handleDisplayWorkType(type: number, isDisplayColor: boolean = false): string {
    if (this.listWorkType?.length <= 0) {
      return isDisplayColor ? '#0000' : '';
    }
    if (type) {
      if (isDisplayColor) {
        var findColor = this.listWorkType.find(x => x.dataStateId === type);
        if (findColor) return findColor.colorCode;
        else return '#0000';
      }
      else {
        var findName = this.listWorkType.find(x => x.dataStateId === type);
        if (findName) return findName.dataStateName;
        else return '';
      }
    }
  }

  handleDisplayStatusApply(data: WorkModel, isDisplayColor: boolean = false): string {
    if (data) {
      var findWorkApplyStatus = this.listWorkApply.find(item => item.workId === data.workId)?.status;
      if (findWorkApplyStatus) {
        if (isDisplayColor) {
          return this.listWorkApplyStatus.find(status => status.dataStateId === findWorkApplyStatus).colorCode;
        } else {
          return this.listWorkApplyStatus.find(status => status.dataStateId === findWorkApplyStatus).dataStateName;
        }
      }
    }
  }

  openMinimizedProfile(user: User, work: WorkModel, tab: number) {
    let dialogRef = this.dialog.open(ApproveTaskerDialogComponent, {
      disableClose: false,
      width: '500px',
      autoFocus: false,
      data: {
        user: user,
        work: work,
        tab: tab
      }
    });

    dialogRef.afterClosed().subscribe(async res => {
      if (res) {
        await this.refreshData();
        this.changeTabWithNumber(2);
      }
    })
  }

  openApplyForWorkDialog(work: WorkModel) {
    const dialogRef = this.dialog.open(AppyWorkComponent, {
      height: 'auto',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        workModel: work
      },
    });

    dialogRef.afterClosed().subscribe(async res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Thành công',
          detail: `Bạn đăng đăng ký thành công. Vui lòng kiểm tra trong phần quản lý công việc đã đăng ký!`, life: 30000
        });
        await this.refreshData();
        this.changeTabWithNumber(1);
      }
    })
  }

  async unSaveWork(work: WorkModel, cancelApply: boolean = false) {
    var message = '';
    if (!cancelApply) message = 'Bạn chắc chắn muốn bỏ lưu công việc này?'
    else message = 'Bạn chắc chắn muốn hủy đăng ký công việc này?'
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        message: message
      }
    });
    dialogRef.afterClosed().subscribe(async response => {
      if (response) {
        var findWorkApply = await this.workService.getWorkApplyByWorkIdAndUserId(work.workId, this.currentUser?.user?.id).toPromise();
        if (findWorkApply.result) {
          var resp = await this.workService.deleteWorkApply(findWorkApply.result).toPromise();
          if (resp.result) {
            await this.refreshData();
            if (cancelApply) {
              this.changeTabWithNumber(2); 
              this.messageService.clear();
              this.messageService.add({
                key: 'toast1', severity: 'success', summary: 'Thành công',
                detail: `Bỏ đăng ký thành công`, life: 30000
              });
            }
            else {
              this.changeTabWithNumber(1);
              this.messageService.clear();
              this.messageService.add({
                key: 'toast1', severity: 'success', summary: 'Thành công',
                detail: `Bỏ lưu thành công`, life: 30000
              });
            }
          }
        }
        
      }
    });
  }

  getTimeLine(startDate: Date | string) {
    var dateCreateWork = new Date(startDate);
    dateCreateWork.setDate(dateCreateWork.getDate() + 10);
    var toDay = new Date();
    var timeLine = Math.ceil((dateCreateWork.getTime() - toDay.getTime()) / (60 * 60 * 1000));
    var timeLineDate = Math.floor(timeLine / 24);
    var timeLineHours = timeLine - timeLineDate * 24;
    if (timeLineDate < 0) return 'Hết hạn';
    return timeLineDate.toString() + ' ngày ' + timeLineHours.toString() + ' giờ';
  }
}
