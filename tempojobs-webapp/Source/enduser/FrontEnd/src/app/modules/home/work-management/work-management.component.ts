import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RxFormBuilder, async } from '@rxweb/reactive-form-validators';
import { Subject, takeUntil } from 'rxjs';
import { DataStateModel } from 'src/app/shared/models/data-state.model';
import { Page } from 'src/app/shared/models/page';
import { WorkModel } from 'src/app/shared/models/work.model';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { PageEvent } from '@angular/material/paginator';
import { FilterMapping } from 'src/app/shared/models/filter-mapping';
import { NbToastrService } from '@nebular/theme';
import { MessageService } from 'primeng/api';
import { WorkApply } from './work-detail/appy-work/work-appy.model';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { GetTimeLineForWork } from 'src/app/shared/utility/Helper';

@Component({
  selector: 'app-work-management',
  templateUrl: './work-management.component.html',
  styleUrls: ['./work-management.component.scss']
})
export class WorkManagementComponent implements OnInit, OnDestroy {

  listWork: WorkModel[] = [];
  listWorkShow: WorkModel[] = [];
  listColors: string[] = [];
  listProvince: any[] = [];
  listWorkType: DataStateModel[] = [];
  listWorkApply: DataStateModel[] = [];
  isCustomizing: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  listFilterProvinces: string[] = [];
  listFilterWorkType: string[] = [];

  paging = new Page();
  pageSizeOptions = [5, 10, 25];
  searchData: string;

  currentUser: any = {};

  savingApplyId: number;

  listWorkStatus: DataStateModel[] = [];
  approvingId: number;
  approvedId: number;
  refuseApprovalId: number;
  processingId: number;
  evaluationId: number;
  doneId: number;

  constructor(
    private formBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private router: Router,
    private dataStateService: DataStateManagementService,
    private messageService: MessageService,
    private authService: NbAuthService,
    public dialog: MatDialog,
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
    .subscribe(async (token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.currentUser = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
      }
    });
    this.paging.filter = [];
    this.dataStateService.getListProvince().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp) {
        this.listProvince = resp;
      }
    });
  }

  async ngOnInit() {
    var respWorkType = await this.dataStateService.getDataStateByType("WORK_TYPE").pipe(takeUntil(this.destroy$)).toPromise();
    if (respWorkType.result) {
      this.listWorkType = respWorkType.result;
    }
    var respWorkApply = await this.dataStateService.getDataStateByType("WORK_APPLY_STATUS").pipe(takeUntil(this.destroy$)).toPromise();
    if (respWorkApply.result) {
      this.listWorkApply = respWorkApply.result;
      this.savingApplyId = this.listWorkApply.find(item => item.dataStateName === 'Đang lưu').dataStateId;
    }
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
    await this.getPagingWork();
  }

  async getPagingWork() {
    var resp = await this.workService.getWorkPaging(this.paging).pipe(takeUntil(this.destroy$)).toPromise()
    if (resp.result) {
      this.listWork = resp.result.data;
      this.paging = resp.result.page;
      this.listWork = this.listWork.filter(work => work.workStatusId === this.approvedId || work.workStatusId === this.processingId);
      this.listWork.map((work) => {
        work.workProvinceName = this.listProvince.find(item => item.codename === work.workProvince)?.name;
        work.timeLine = GetTimeLineForWork(work?.startDate);
        work.listWorkApply = [];
        work.isSaving = false;
        work.workApply.map(async item => {
          var resp = await this.workService.getWorkApplyById(item).pipe(takeUntil(this.destroy$)).toPromise();
          if (resp.result && resp.result.userId === this.currentUser?.user?.id) {
            if (resp.result.status === this.savingApplyId) work.isSaving = true;
            work.listWorkApply.push(resp.result);
          }
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterWork(event?: any, prop?: any, data?: any) {
    this.isCustomizing = true;
    if (prop === 'ALL_TYPE') this.paging.filter = this.paging.filter.filter(item => item.prop !== 'workType');
    else if (prop === 'ALL_PROVINCE') this.paging.filter = this.paging.filter.filter(item => item.prop !== 'workProvince');
    else {
      if (event?.checked) {
        var filter = new FilterMapping();
        filter.prop = prop;
        filter.value = data;
        filter.filterType = 'check';
        this.paging.filter.push(filter);
      } else if (prop === 'SEARCHING') {
        this.paging.filter = this.paging.filter.filter(item => item.prop !== 'SEARCHING');
        var filter = new FilterMapping();
        filter.prop = prop;
        filter.value = this.searchData;
        filter.filterType = 'search';
        this.paging.filter.push(filter);
      }
      else {
        var indexFilter = this.paging?.filter?.findIndex(x => x.prop === prop && x.value === data);
        if (indexFilter > -1) {
          this.paging?.filter?.splice(indexFilter, 1);
        }
      }
    }

    this.getPagingWork();

    // var listWorkFilter = [];
    // if (this.listFilterWorkType.length == 0 && this.listFilterProvinces.length == 0) {
    //   listWorkFilter = this.listWork;
    // } else if (this.listFilterWorkType.length > 0 && this.listFilterProvinces.length > 0) {
    //   var resultFilterType = [];
    //   this.listFilterWorkType.map(item => resultFilterType = resultFilterType.concat(this.listWork.filter(work => work.workTypeId === item)));
    //   this.listFilterProvinces.map(item => listWorkFilter = listWorkFilter.concat(resultFilterType.filter(work => work.workProvince === item)));
    // } else if (this.listFilterWorkType.length > 0) {
    //   this.listFilterWorkType.map(item => listWorkFilter = listWorkFilter.concat(this.listWork.filter(work => work.workTypeId === item)));
    // } else if (this.listFilterProvinces.length > 0) {
    //   this.listFilterProvinces.map(item => listWorkFilter = listWorkFilter.concat(this.listWork.filter(work => work.workProvince === item)));
    // }

    // listWorkFilter = listWorkFilter.filter((work, index) => listWorkFilter.indexOf(work) === index);
    // this.listWorkShow = [...listWorkFilter];
    this.isCustomizing = false;
  }

  handlePageEvent(e: PageEvent) {
    this.paging.totalElements = e.length;
    this.paging.size = e.pageSize;
    this.paging.pageNumber = e.pageIndex;
    this.getPagingWork();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  openWorkDetail(work: WorkModel = null) {
    if (!work) {
      this.messageService.clear();
      this.messageService.add({
        key: 'toast1', severity: 'warn', summary: 'Lỗi',
        detail: 'Có lỗi xảy ra, xin vui lòng chọn công việc khác.', life: 20000
      });
    } else {
      this.router.navigateByUrl(`/work/${work.workId}`);
    }
  }

  async saveWorkInToStore(work: WorkModel) {
    if (work.listWorkApply && work.listWorkApply.length > 0) {
      if (work.isSaving) {
        var findWorkApply = work.listWorkApply.find(item => item.status === this.savingApplyId);
        if (findWorkApply) {
          var unSaving = await this.workService.deleteWorkApply(findWorkApply).pipe(takeUntil(this.destroy$)).toPromise();
          if (unSaving.result) {
            await this.getPagingWork();
            this.messageService.clear();
            this.messageService.add({
              key: 'toast1', severity: 'success', summary: 'Bỏ lưu thành công',
              detail: `Kiểm tra công việc đã lưu trong phần quản lý công việc nhận làm!`, life: 30000
            });
          } else {
            this.messageService.clear();
            this.messageService.add({
              key: 'toast1', severity: 'error', summary: 'Lưu thất bại',
              detail: unSaving.message.toString(), life: 30000
            });
          }
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'warn', summary: 'Công việc này đã được đăng ký',
          detail: `Vui lòng kiểm tra mục "Gửi hồ sơ" trong phần quản lý công việc nhận làm`, life: 30000
        });
      }
    } else {
      var workApplyModel = new WorkApply();
      workApplyModel.userId = this.currentUser?.user?.id;
      workApplyModel.workId = work.workId;
      workApplyModel.status = this.savingApplyId;
      var res = await this.workService.applyForWork(workApplyModel, this.currentUser?.user?.id).pipe(takeUntil(this.destroy$)).toPromise();
      if(res.result) {
        await this.getPagingWork();
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Lưu thành công',
          detail: `Kiểm tra mục công việc đã lưu trong phần quản lý công việc nhận làm!`, life: 30000
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'error', summary: 'Lưu thất bại',
          detail: `Công việc đã bị hủy hoặc hết hạn!`, life: 30000
        });
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

  openUserDetailDialog(userId: string = "") {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      height: 'auto',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        userId: userId
      },
    });
  }
}