import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
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

  constructor(
    private formBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private router: Router,
    private dataStateService: DataStateManagementService,
    private messageService: MessageService,
    private authService: NbAuthService,
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
    await this.getPagingWork();
  }

  async getPagingWork() {
    var resp = await this.workService.getWorkPaging(this.paging).pipe(takeUntil(this.destroy$)).toPromise()
    if (resp.result) {
      this.listWork = resp.result.data;
      this.paging = resp.result.page;
      this.listWork.map((work) => {
        work.workProvinceName = this.listProvince.find(item => item.codename === work.workProvince)?.name;
        work.timeLine = this.getTimeLine(work?.createdAt);
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

  saveWorkInToStore(work: WorkModel) {
    var workApplyModel = new WorkApply();
    workApplyModel.userId = this.currentUser.user.id;
    workApplyModel.workId = work.workId;
    workApplyModel.status = this.savingApplyId;
    this.workService.applyForWork(workApplyModel, this.currentUser.user.id).subscribe(res => {
      if(res.result) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Lưu thành công',
          detail: `Kiểm tra công việc đã lưu trong phần quản lý công việc đã đăng ký!`, life: 30000
        });
      }
    })
  }
}