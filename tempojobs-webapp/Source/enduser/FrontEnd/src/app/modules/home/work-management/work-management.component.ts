import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-work-management',
  templateUrl: './work-management.component.html',
  styleUrls: ['./work-management.component.scss']
})
export class WorkManagementComponent implements OnInit {
  listWork: WorkModel[] = [];
  listWorkShow: WorkModel[] = [];
  listColors: string[] = [];
  listProvince: any[] = [];
  listWorkType: DataStateModel[] = [];
  isCustomizing: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  listFilterProvinces: string[] = [];
  listFilterWorkType: string[] = [];

  paging = new Page();
  pageSizeOptions = [5, 10, 25];
  searchData: string;

  constructor(
    private formBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private router: Router,
    private dataStateService: DataStateManagementService,
    private nbToast: NbToastrService
  ) {
    this.paging.filter = [];
    this.dataStateService.getListProvince().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp) {
        this.listProvince = resp;
      }
    });
  }

  ngOnInit(): void {
    this.dataStateService.getDataStateByType("WORK_TYPE").pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp.result) {
        this.listWorkType = resp.result;
      }
    });
    this.getPagingWork();
  }

  getPagingWork() {
    this.workService.getWorkPaging(this.paging).pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp.result) {
        this.listWork = resp.result.data;
        this.paging = resp.result.page;
        this.listWork.map((work) => {
          work.workProvinceName = this.listProvince.find(item => item.codename === work.workProvince)?.name;
          work.timeLine = this.getTimeLine(work?.createdAt);
        });
      }
    });
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
    var timeLine = Math.ceil((dateCreateWork.getTime() - toDay.getTime()) / (60*60*1000));
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
    if(!work) {
      this.nbToast.warning("Có lỗi xảy ra, xin vui lòng chọn công việc các", "Lỗi")
    } else {
      
    }
  }
}