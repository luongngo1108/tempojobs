import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { Router } from '@angular/router';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { NbToastrService } from '@nebular/theme';
import { MessageService } from 'primeng/api';
import { DataStateModel } from 'src/app/shared/models/data-state.model';
import { Page } from 'src/app/shared/models/page';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  listWork: WorkModel[] = [];
  listProvince: any[] = [];
  listColors: string[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  isIntro: boolean = true;

  paging = new Page();

  listWorkStatus: DataStateModel[] = [];
  approvingId: number;
  approvedId: number;
  refuseApprovalId: number;
  processingId: number;
  evaluationId: number;
  doneId: number;
  
  constructor(
    private workService: WorkManagementService,
    private router: Router,
    private dataStateService: DataStateManagementService,
    private messageService: MessageService
  ) {
    this.paging.filter = [];
  }

  async ngOnInit() {
    if (this.router.url !== "/") {
      this.isIntro = false;
    }
    await this.getDataDefaults();
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
        work.timeLine = this.getTimeLine(work?.createdAt);
      });
    }
  }

  async getDataDefaults() {
    var resultProvince = await this.dataStateService.getListProvince().pipe(takeUntil(this.destroy$)).toPromise();
    if (resultProvince) {
      this.listProvince = resultProvince;
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
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
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

  openWorkDetail(work: WorkModel = null) {
    if(!work) {
      this.messageService.clear();
      this.messageService.add({key: 'toast1', severity: 'error', summary: 'Lỗi', 
              detail: `Có lỗi xảy ra, xin vui lòng chọn công việc khác!`, life: 20000  });
    } else {
      this.router.navigateByUrl(`/work/${work.workId}`);
    }
  }
}
