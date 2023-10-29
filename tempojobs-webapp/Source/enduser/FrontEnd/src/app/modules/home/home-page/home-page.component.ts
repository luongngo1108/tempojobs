import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { Router } from '@angular/router';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';

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
  
  constructor(
    private workService: WorkManagementService,
    private router: Router,
    private dataStateService: DataStateManagementService,
  ) {

  }

  async ngOnInit() {
    if (this.router.url !== "/") {
      this.isIntro = false;
    }
    await this.getDataDefaults();
    this.workService.getAllWork().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp.result) {
        this.listWork = resp.result;
        this.listWork.map((work) => {
          work.workProvinceName = this.listProvince.find(item => item.codename === work.workProvince)?.name;
          work.timeLine = this.getTimeLine(work?.createdAt);
        });
      }
    });
  }

  async getDataDefaults() {
    var resultProvince = await this.dataStateService.getListProvince().pipe(takeUntil(this.destroy$)).toPromise();
    if (resultProvince) {
      this.listProvince = resultProvince;
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
}
