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
@Component({
  selector: 'app-created-manage',
  templateUrl: './created-manage.component.html',
  styleUrls: ['./created-manage.component.scss']
})
export class CreatedManageComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['workName', 'workTypeName', 'workProfit', 'workStatusName', 'moreAction'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  listWork: WorkModel[] = [];
  listWorkShow: WorkModel[] = [];
  listWorkType: DataStateModel[] = [];
  listWorkStatus: DataStateModel[] = [];
  approvingId: number;
  approvedId: number;
  refuseApprovalId: number;
  currentUser;
  countTab1: number;
  countTab2: number;
  countTab3: number;
  countTab4: number;
  paymentToken = null;
  paymentMessage = null;
  amount = null;
  userId = null;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private workService: WorkManagementService,
    private dataStateService: DataStateManagementService,
    private authService: NbAuthService,
    private router: Router,
    private toast: NbToastrService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private paymentService: PaymentServiceService,
    private _location: Location
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
    await this.getDataDefaults();
    await this.refreshData();
    if (this.paymentToken && this.paymentMessage.includes("Successful.") && this.userId) {
      this.paymentService.momoPayementSuccess({ paymentToken: this.paymentToken, amount: this.amount, userId: this.userId }).subscribe(res => {
        if (res.result) this.toast.success("Bạn đã thanh toán thành công!!", "Thanh toán thành công", { duration: 30000 });
      })
    }
  }

  async getDataDefaults() {
    var resultStatus = await this.dataStateService.getDataStateByType("WORK_STATUS").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultStatus.result) {
      this.listWorkStatus = resultStatus.result;
      this.approvingId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Đang duyệt').dataStateId;
      this.approvedId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Đã duyệt').dataStateId;
      this.refuseApprovalId = this.listWorkStatus.find(workStatus => workStatus.dataStateName === 'Từ chối duyệt').dataStateId;
    }
    var resultType = await this.dataStateService.getDataStateByType("WORK_TYPE").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultType.result) {
      this.listWorkType = resultType.result;
    }
  }

  async getListWorksDefaults() {
    var resultListWork = await this.workService.getWorkByCreatorId(this.currentUser?.user?.id).pipe(takeUntil(this.destroy$)).toPromise();
    if (resultListWork.result) {
      this.listWork = resultListWork.result;
      this.listWork.map(work => {
        work.workTypeName = this.listWorkType.find(type => type.dataStateId === work.workTypeId)?.dataStateName;
      });
      this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId);
    }
  }

  counterTab() {
    const filterTab1 = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId);
    if (filterTab1.length > 0) {
      this.countTab1 = filterTab1.length;
    }
    const filterTab2 = this.listWork.filter(work => work.workStatusId === this.approvedId);
    if (filterTab2.length > 0) {
      this.countTab2 = filterTab2.length;
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
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvingId || work.workStatusId === this.refuseApprovalId);
        break;
      case 2:
        this.listWorkShow = this.listWork.filter(work => work.workStatusId === this.approvedId);
        break;
      case 3:
        break;
      case 4:
        break;
    }
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
  
  editWork(work: WorkModel) {
    if (work) {
      this.router.navigate(['add-edit-work'], { state: {work: work}});
    }
  }
  
  deleteWork(work: WorkModel) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        message: "Bạn chắc chắn muốn xóa công việc này?"
      }
    });
  
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        if (work) {
          this.workService.deleteWork(work.workId).subscribe(resp => {
            if (resp.result) {
              this.toast.success("Xóa công việc thành công!");
            } else {
              this.toast.danger("Bạn không thể xóa công việc này!");
            }
          }).add(() => this.refreshData())
        }
      }
    });
  }
}