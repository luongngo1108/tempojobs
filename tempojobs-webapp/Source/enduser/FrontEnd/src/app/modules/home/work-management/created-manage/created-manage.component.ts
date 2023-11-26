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
  currentUser;
  countTab1: number;
  countTab2: number;
  countTab3: number;
  countTab4: number;
  paymentToken = null;
  paymentMessage = null;
  amount = null;
  userId = null;

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
    });
    this._location.go('created-manage');
  }

  async ngOnInit() {
    if (this.paymentToken && this.paymentMessage.includes("Successful.") && this.userId) {
      var paymentResult = await lastValueFrom(this.paymentService.momoPayementSuccess({ paymentToken: this.paymentToken, amount: this.amount, userId: this.userId }));
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
        work.timeLine = this.getTimeLine(work?.startDate, work?.createdAt);
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
    const filterTab2 = this.listWork.filter(work => work.workStatusId === this.approvedId);
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

  getTimeLine(startDate: Date | string, createdDate: Date | string) {
    var dateStartWork = new Date(startDate);
    var dateCreatedWork = new Date(createdDate);
    var toDay = new Date();
    if (toDay.getTime() > dateStartWork.getTime()) {
      return 'Hết hạn';
    } else {
      var timeLine = Math.ceil((dateStartWork.getTime() - dateCreatedWork.getTime()) / (60 * 60 * 1000));
      var timeLineDate = Math.floor(timeLine / 24);
      var timeLineHours = timeLine - timeLineDate * 24;
      if (timeLineDate < 0) return 'Hết hạn';
      return timeLineDate.toString() + ' ngày ' + timeLineHours.toString() + ' giờ';
    }
  }

  changeTab(event) {
    switch (Number(event.tabId)) {
      case 1:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId || work.workStatusId === this.waitForPaymentId);
        break;
      case 2:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvedId);
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
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId);
        break;
      case 2:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvedId);
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
    var startDate = new Date(workModel.startDate);
    var createdAt = new Date(workModel.createdAt);
    const diffTime = Math.abs(Number(startDate) - Number(createdAt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    var amount = diffDays * 5000 + workModel.quantity * 1000;
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
          userEmail: workModel.createdBy.email, inputAmount: amount, workId: workModel.workId
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
        this.changeTabWithNumber(2);
      }
    })
  }

  extendTimeLine() {

  }

  // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //   data: {
  //     content: `Vui lòng hoàn thành thanh toán ${amount} vnd để có thể đăng tải công việc!\n` +
  //       "Chúng tôi chỉ chấp nhận hình thức thanh toán bằng MOMO!",
  //     nextButtonContent: "Thanh toán"
  //   },
  // });

  // dialogRef.afterClosed().subscribe(async result => {
  //   if (result) {
  //     // Save work
  //     this.workModel = model;
  //     console.log(this.workModel)
  //     const latLng = {
  //       lat: parseFloat(this.latitude?.toString()),
  //       lng: parseFloat(this.longitude?.toString())
  //     }
  //     try {
  //       await this.geocoder.geocode({ location: latLng }).then(async response => {
  //         if (response.results[0]) {
  //           this.workModel.googleLocation.address = response.results[0].formatted_address;
  //           this.workModel.googleLocation.latitude = this.latitude;
  //           this.workModel.googleLocation.longitude = this.longitude;
  //         }
  //       })
  //     } catch (error) {
  //       console.log("Request limited!!!");
  //     }

  //     if (!this.workModel?.workId) {
  //       model.workId = 0;
  //       model.workStatusId = this.listWorkStatus?.find(workStatus => workStatus.dataStateName === 'Đang cần được thanh toán')?.dataStateId;
  //     } else {
  //       if (model.workStatusId === this.listWorkStatus?.find(workStatus => workStatus.dataStateName === 'Từ chối duyệt')?.dataStateId) {
  //         model.workStatusId = this.listWorkStatus?.find(workStatus => workStatus.dataStateName === 'Đang duyệt')?.dataStateId;
  //       }
  //     }
  //     if (this.createBy) {
  //       model.createdById = this.createBy?.user?.id;
  //       model.createdBy = this.createBy?.user;
  //     }
  //     if (!model.workApply) {
  //       model.workApply = [];
  //     }
  //     var respSaveWork = await lastValueFrom(this.workService.saveWork(model));
  //     if (respSaveWork.result) {
  //       this.workModel = respSaveWork.result;
  //       // create momo payment
  //       // var respCreatePayment = await lastValueFrom(this.paymentService.createMomoPayment({ userEmail: this.workModel.createdBy.email, inputAmount: amount, workId: this.workModel.workId }));
  //       // if (respCreatePayment.result) window.location.href = respCreatePayment.result;
  //       this.router.navigateByUrl('/created-manage');
  //     }
  //   }
  // });

}
