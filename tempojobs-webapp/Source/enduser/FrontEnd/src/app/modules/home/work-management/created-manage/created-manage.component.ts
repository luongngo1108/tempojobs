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
import { ApproveTaskerDialogComponent } from './approve-tasker-dialog/approve-tasker-dialog.component';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CalculateMoneyPayment, GetTimeLineForWork } from 'src/app/shared/utility/Helper';
import { ExtendDayDialogComponent } from './extend-day-dialog/extend-day-dialog.component';
import { PaymentType } from 'src/app/shared/enums/payment-type';
import { WorkApplyDialogComponent } from './work-apply-dialog/work-apply-dialog.component';
@Component({
  selector: 'app-created-manage',
  templateUrl: './created-manage.component.html',
  styleUrls: ['./created-manage.component.scss']
})
export class CreatedManageComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumnsTab1: string[] = ['workName', 'workTypeName', 'workProfit', 'workStatusName', 'moreAction'];
  displayedColumnsTab2: string[] = ['workName', 'candidate', 'candidateApproval', 'candidateRefused', 'confirm'];
  displayedColumnsTab3: string[] = ['workName', 'candidateApproval', 'confirm'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  listWork: WorkModel[] = [];
  listWorkShow: WorkModel[] = [];
  listWorkType: DataStateModel[] = [];
  listWorkStatus: DataStateModel[] = [];
  listWorkApplyStatus: DataStateModel[] = [];

  // work status ID
  approvingId: number;
  approvedId: number;
  refuseApprovalId: number;
  processingId: number;
  evaluationId: number;
  waitForPaymentId: number;
  doneId: number;
  expiredId: number;

  currentUser;
  countTab1: number;
  countTab2: number;
  countTab3: number;
  countTab4: number;
  paymentToken = null;
  paymentMessage = null;
  amount = null;
  userId = null;
  paymentType = null;
  extendDay = null;
  // work apply status ID
  waitingApplyId: number;
  acceptApplyId: number;
  refusedApplyId: number;

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

    this.route.queryParams.subscribe(params => {
      this.paymentToken = params['paymentToken'];
      this.paymentMessage = params['message'];
      this.userId = params['userId'];
      this.amount = params['amount'];
      this.paymentType = params['paymentType'];
      this.extendDay = params['extendDay'];
    });
    this._location.go('created-manage');
  }

  async ngOnInit() {
    if (this.paymentToken && this.paymentMessage.includes("Successful.") && this.userId) {
      var paymentResult = await lastValueFrom(this.paymentService.momoPayementSuccess({ 
        paymentToken: this.paymentToken,
         amount: this.amount, 
         userId: this.userId,
         paymentType: this.paymentType,
         extendDay: this.extendDay
        }));
      if(paymentResult) {
        this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'success', summary: 'Thành công',
            detail: `Bạn đã thanh toán thành công với số tiền là ${this.amount} vnd`, life: 20000
          });
      }  
    }
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
      this.waitForPaymentId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Đang cần được thanh toán')?.dataStateId;
      this.expiredId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Hết hạn')?.dataStateId;
    }
    var resultType = await this.dataStateService.getDataStateByType("WORK_TYPE").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultType.result) {
      this.listWorkType = resultType.result;
    }
    var resultApply = await this.dataStateService.getDataStateByType("WORK_APPLY_STATUS").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultApply.result) {
      this.listWorkApplyStatus = resultApply.result;
      this.waitingApplyId = this.listWorkApplyStatus.find(workApplyStatus => workApplyStatus.dataStateName === 'Đang đăng ký').dataStateId;
      this.acceptApplyId = this.listWorkApplyStatus.find(workApplyStatus => workApplyStatus.dataStateName === 'Được nhận').dataStateId;
      this.refusedApplyId = this.listWorkApplyStatus.find(workApplyStatus => workApplyStatus.dataStateName === 'Bị từ chối').dataStateId;
    }
  }

  async getListWorksDefaults() {
    var resultListWork = await this.workService.getWorkByCreatorId(this.currentUser?.user?.id).pipe(takeUntil(this.destroy$)).toPromise();
    if (resultListWork.result) {
      this.listWork = resultListWork.result;
      this.listWork.map(work => {
        work.timeLine = GetTimeLineForWork(work?.startDate);
      });
      this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId || work.workStatusId === this.waitForPaymentId);
    }
  }

  counterTab() {
    const filterTab1 = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId || work.workStatusId === this.waitForPaymentId);
    if (filterTab1.length > 0) {
      this.countTab1 = filterTab1.length;
    } else {
      this.countTab1 = null;
    }
    const filterTab2 = this.listWork.filter(work => work.workStatusId === this.approvedId || work.workStatusId === this.expiredId);
    if (filterTab2.length > 0) {
      this.countTab2 = filterTab2.length;
    } else {
      this.countTab2 = null;
    }
    const filterTab3 = this.listWork.filter(work => work.workStatusId === this.processingId);
    if (filterTab3.length > 0) {
      this.countTab3 = filterTab3.length;
    } else {
      this.countTab3 = null;
    }
    const filterTab4 = this.listWork.filter(work => work.workStatusId === this.evaluationId);
    if (filterTab4.length > 0) {
      this.countTab4 = filterTab4.length;
    } else {
      this.countTab4 = null;
    }
  }

  async refreshData() {
    await this.getListWorksDefaults();
    this.counterTab();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTab(event) {
    switch (Number(event.tabId)) {
      case 1:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId || work.workStatusId === this.waitForPaymentId);
        break;
      case 2:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvedId || work.workStatusId === this.expiredId);
        this.listWorkShow.map(work => {
          if (work.workApply && work.workApply.length > 0) {
            work.listTaskerWaitings = [];
            work.listTaskerAccepted = [];
            work.listTaskerRefused = [];
            work.workApply.map(async workApplyId => {
              var respWorkApply = await lastValueFrom(this.workService.getWorkApplyById(workApplyId));
              if (respWorkApply.result && respWorkApply.result.status === this.waitingApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerWaitings.push(resp.result);
                }
              }
              if (respWorkApply.result && respWorkApply.result.status === this.acceptApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerAccepted.push(resp.result);
                }
              }
              if (respWorkApply.result && respWorkApply.result.status === this.refusedApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerRefused.push(resp.result);
                }
              }
            })
          }
        });
        break;
      case 3:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.processingId);
        this.listWorkShow.map(work => {
          if (work.workApply && work.workApply.length > 0) {
            work.listTaskerAccepted = [];
            work.workApply.map(async workApplyId => {
              var respWorkApply = await lastValueFrom(this.workService.getWorkApplyById(workApplyId));
              if (respWorkApply.result && respWorkApply.result.status === this.acceptApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerAccepted.push(resp.result);
                }
              }
            })
          }
        });
        break;
      case 4:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.evaluationId);
        this.listWorkShow.map(work => {
          if (work.workApply && work.workApply.length > 0) {
            work.listTaskerAccepted = [];
            work.workApply.map(async workApplyId => {
              var respWorkApply = await lastValueFrom(this.workService.getWorkApplyById(workApplyId));
              if (respWorkApply.result && respWorkApply.result.status === this.acceptApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerAccepted.push(resp.result);
                }
              }
            })
          }
        });
        break;
    }
  }

  changeTabWithNumber(data: number) {
    switch (data) {
      case 1:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId || work.workStatusId === this.waitForPaymentId);
        break;
      case 2:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvedId || work.workStatusId === this.expiredId);
        this.listWorkShow.map(work => {
          if (work.workApply && work.workApply.length > 0) {
            work.listTaskerWaitings = [];
            work.listTaskerAccepted = [];
            work.listTaskerRefused = [];
            work.workApply.map(async workApplyId => {
              var respWorkApply = await lastValueFrom(this.workService.getWorkApplyById(workApplyId));
              if (respWorkApply.result && respWorkApply.result.status === this.waitingApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerWaitings.push(resp.result);
                }
              }
              if (respWorkApply.result && respWorkApply.result.status === this.acceptApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerAccepted.push(resp.result);
                }
              }
              if (respWorkApply.result && respWorkApply.result.status === this.refusedApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerRefused.push(resp.result);
                }
              }
            })
          }
        });
        break;
      case 3:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.processingId);
        this.listWorkShow.map(work => {
          if (work.workApply && work.workApply.length > 0) {
            work.listTaskerAccepted = [];
            work.workApply.map(async workApplyId => {
              var respWorkApply = await lastValueFrom(this.workService.getWorkApplyById(workApplyId));
              if (respWorkApply.result && respWorkApply.result.status === this.acceptApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerAccepted.push(resp.result);
                }
              }
            })
          }
        });
        break;
      case 4:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.evaluationId);
        this.listWorkShow.map(work => {
          if (work.workApply && work.workApply.length > 0) {
            work.listTaskerAccepted = [];
            work.workApply.map(async workApplyId => {
              var respWorkApply = await lastValueFrom(this.workService.getWorkApplyById(workApplyId));
              if (respWorkApply.result && respWorkApply.result.status === this.acceptApplyId) {
                var resp = await lastValueFrom(this.userService.getUserById(respWorkApply?.result?.userId));
                if (resp.result) {
                  work.listTaskerAccepted.push(resp.result);
                }
              }
            })
          }
        });
        break;
    }
  }

  async createPayment(workModel: any) {
    const amount = CalculateMoneyPayment(workModel.startDate);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        content: `Bạn có chắc muốn tiếp tục thanh toán?`,
        nextButtonContent: "Thanh toán"
      },
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        var respCreatePayment = await lastValueFrom(this.paymentService.createMomoPayment({
          userEmail: workModel.createdBy.email, 
          inputAmount: amount, 
          workId: workModel.workId,
          paymentType: PaymentType.PayForWork
        }));
        if (respCreatePayment.result) window.location.href = respCreatePayment.result;
      }
    })
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

  editWork(work: WorkModel) {
    if (work) {
      this.router.navigate(['add-edit-work'], { state: { work: work } });
    }
  }

  deleteWork(work: WorkModel) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        message: "Bạn chắc chắn muốn xóa công việc này?"
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        if (work) {
          this.workService.deleteWork(work.workId).subscribe(resp => {
            if (resp.result) {
              this.messageService.clear();
              this.messageService.add({
                key: 'toast1', severity: 'success', summary: 'Thành công',
                detail: `Xóa công việc thành công.`, life: 20000
              });
            } else {
              this.messageService.clear();
              this.messageService.add({
                key: 'toast1', severity: 'error', summary: 'Lỗi',
                detail: `Bạn không thể xóa công việc này`, life: 20000
              });
            }
          }).add(async () => {
            await this.refreshData();
            this.changeTabWithNumber(1);
          })
        }
      }
    });
  }

  changeWorkStatus(work: WorkModel, status: number, tab: number) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        message: "Xác nhận công việc đã hoàn thành?"
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        if (work) {
          work.workStatusId = status;
          this.workService.saveWork(work).subscribe(resp => {
            if (resp.result) {
              this.messageService.clear();
              this.messageService.add({
                key: 'toast1', severity: 'success', summary: 'Thành công',
                detail: `Xác nhận thành công!`, life: 2000
              });
            } else {
              this.messageService.clear();
              this.messageService.add({
                key: 'toast1', severity: 'error', summary: 'Thấy bại',
                detail: `Xác nhận thất bại!`, life: 2000
              });
            }
          }).add(async () => {
            await this.refreshData();
            this.changeTabWithNumber(tab);
          })
        }
      }
    });
  }

  openMinimizedProfile(user: User, work: WorkModel, tab: number) {
    let dialogRef = this.dialog.open(ApproveTaskerDialogComponent, {
      disableClose: false,
      width: '500px',
      autoFocus: false,
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        user: user,
        work: work,
        tab: tab
      }
    });

    dialogRef.afterClosed().subscribe(async res => {
      if (res) {
        await this.refreshData();
        this.changeTabWithNumber(tab);
      }
    })
  }

  extendTimeLine(work: any) {
    let dialogRef = this.dialog.open(ExtendDayDialogComponent, {
      disableClose: false,
      autoFocus: false,
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        workModel: work
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        
      }
    })
  }

  openUserApplied(data: WorkModel) {
    const dialogRef = this.dialog.open(WorkApplyDialogComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        model: data
      },
    });
  }
}
