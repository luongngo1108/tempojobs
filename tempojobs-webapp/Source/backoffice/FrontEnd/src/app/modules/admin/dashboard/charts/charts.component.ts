import { Component, OnDestroy, OnInit } from '@angular/core';
import type { EChartsOption } from 'echarts';
import { PaymentService } from '../payment.service';
import { PaymentHistory } from '../payment-history.model';
import { WorkService } from '../../work-management/work.service';
import { WorkModel } from '../../work-management/work.model';
import { UserManagementService } from '../../user-management/user-management.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {
  user: any = {};
  private destroy$: Subject<void> = new Subject<void>();

  chartOption: EChartsOption;
  isLoadingChart: boolean = false;
  typeChartDefault: boolean = true;

  listAllWork: WorkModel[];
  listPaymentHistory = [];
  listAllUsers = [];

  dataLegend: string[] = ['Pay for work', 'Pay for extend more date', 'Jobs Created', 'Subscribers'];
  dataXAxis: string[];

  constructor(
    private authService: NbAuthService,
    private paymentService: PaymentService,
    private workService: WorkService,
    private userService: UserManagementService,
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
    .subscribe(async (token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 

      }
    });
  }

  async ngOnInit() {
    this.isLoadingChart = !this.isLoadingChart;
    var respPayment = await this.paymentService.getAllPayment().pipe(takeUntil(this.destroy$)).toPromise();
    if (respPayment.data) {
      this.listPaymentHistory = respPayment.data;
    }
    var respWork = await this.workService.getAllWork().pipe(takeUntil(this.destroy$)).toPromise();
    if (respWork.result) {
      this.listAllWork = respWork.result;
    }
    var respUser = await this.userService.getAllUserDetail(this.user?.user?.email).toPromise();
    if (respUser) {
      this.listAllUsers = respUser.data;
    }
    this.refreshChart('week');
    this.isLoadingChart = !this.isLoadingChart;
  }

  refreshChart(value) {
    this.isLoadingChart = !this.isLoadingChart;
    var type = '';
    if (typeof value !== 'string') {
      type = value[0];
    } else type = value;
    this.dataXAxis = [];
    var dataSubscribers = [];
    var dataJobCreated = [];
    var dataPayForWork = [];
    var dataPayForExtendMoreDate = [];
    var date = new Date();
    switch (type) {
      case 'week':
        this.dataXAxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var currentDate = new Date();
        var dayOfWeek = currentDate.getDay();
        var firstDayOfWeek = new Date(currentDate.getTime());
        firstDayOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1));
        for (let i = 0; i < 7; i++) {
          var totalSubscribersInDate = 0;
          var totalWorkCreatedInDate = 0;
          var totalPayForWorkInDate = 0;
          var totalPayForExtendMoreInDate = 0;
          var loopDate = new Date(firstDayOfWeek.getTime());
          loopDate.setDate(firstDayOfWeek.getDate() + i);
          this.listAllUsers?.map(user => {
            var createUserDate = new Date(user?.createdAt);
            if (createUserDate?.getDate() === loopDate?.getDate() && createUserDate?.getMonth() === loopDate?.getMonth() && createUserDate?.getFullYear() === loopDate?.getFullYear()) {
              totalSubscribersInDate += 1;
            }
          });
          dataSubscribers.push(totalSubscribersInDate);
          this.listAllWork?.map(work => {
            var createWorkDate = new Date(work?.createdAt);
            if (createWorkDate?.getDate() === loopDate?.getDate() && createWorkDate?.getMonth() === loopDate?.getMonth() && createWorkDate?.getFullYear() === loopDate?.getFullYear()) {
              totalWorkCreatedInDate += 1;
            }
          });
          dataJobCreated.push(totalWorkCreatedInDate);
          this.listPaymentHistory?.map(paymentHistory => {
            var createPaymentHistory = new Date(paymentHistory?.createdAt);
            if (createPaymentHistory?.getDate() === loopDate?.getDate() && createPaymentHistory?.getMonth() === loopDate?.getMonth() && createPaymentHistory?.getFullYear() === loopDate?.getFullYear()) {
              if (paymentHistory?.paymentType === 'PayForWork') {
                totalPayForWorkInDate += paymentHistory?.amount;
              } else {
                totalPayForExtendMoreInDate += paymentHistory?.amount;
              }
            }
          });
          dataPayForExtendMoreDate.push(totalPayForExtendMoreInDate);
          dataPayForWork.push(totalPayForWorkInDate);
        }
        break;
      case 'month':
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var currentYear = currentDate.getFullYear();
        var firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        var lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        for (let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth.getDate(); i++) {
          var loopDate = new Date(currentYear, currentMonth, i);
          this.dataXAxis.push(loopDate.getDate().toString());
          var totalSubscribersInDate = 0;
          var totalWorkCreatedInDate = 0;
          var totalPayForWorkInDate = 0;
          var totalPayForExtendMoreInDate = 0;
          this.listAllUsers?.map(user => {
            var createUserDate = new Date(user?.createdAt);
            if (createUserDate?.getDate() === loopDate?.getDate() && createUserDate?.getMonth() === loopDate?.getMonth() && createUserDate?.getFullYear() === loopDate?.getFullYear()) {
              totalSubscribersInDate += 1;
            }
          });
          dataSubscribers.push(totalSubscribersInDate);
          this.listAllWork?.map(work => {
            var createWorkDate = new Date(work?.createdAt);
            if (createWorkDate?.getDate() === loopDate?.getDate() && createWorkDate?.getMonth() === loopDate?.getMonth() && createWorkDate?.getFullYear() === loopDate?.getFullYear()) {
              totalWorkCreatedInDate += 1;
            }
          });
          dataJobCreated.push(totalWorkCreatedInDate);
          this.listPaymentHistory?.map(paymentHistory => {
            var createPaymentHistory = new Date(paymentHistory?.createdAt);
            if (createPaymentHistory?.getDate() === loopDate?.getDate() && createPaymentHistory?.getMonth() === loopDate?.getMonth() && createPaymentHistory?.getFullYear() === loopDate?.getFullYear()) {
              if (paymentHistory?.paymentType === 'PayForWork') {
                totalPayForWorkInDate += paymentHistory?.amount;
              } else {
                totalPayForExtendMoreInDate += paymentHistory?.amount;
              }
            }
          });
          dataPayForExtendMoreDate.push(totalPayForExtendMoreInDate);
          dataPayForWork.push(totalPayForWorkInDate);
        }
        break;
      case 'year':
        var year = date.getFullYear();
        for (var i = year - 1; i <= year + 3; i++) {
          this.dataXAxis.push(i.toString());
          var totalSubscribersInDate = 0;
          var totalWorkCreatedInDate = 0;
          var totalPayForWorkInDate = 0;
          var totalPayForExtendMoreInDate = 0;
          this.listAllUsers?.map(user => {
            var createUserDate = new Date(user?.createdAt);
            if (createUserDate?.getFullYear() === i) {
              totalSubscribersInDate += 1;
            }
          });
          dataSubscribers.push(totalSubscribersInDate);
          this.listAllWork?.map(work => {
            var createWorkDate = new Date(work?.createdAt);
            if (createWorkDate?.getFullYear() === i) {
              totalWorkCreatedInDate += 1;
            }
          });
          dataJobCreated.push(totalWorkCreatedInDate);
          this.listPaymentHistory?.map(paymentHistory => {
            var createPaymentHistory = new Date(paymentHistory?.createdAt);
            if (createPaymentHistory?.getFullYear() === i) {
              if (paymentHistory?.paymentType === 'PayForWork') {
                totalPayForWorkInDate += paymentHistory?.amount;
              } else {
                totalPayForExtendMoreInDate += paymentHistory?.amount;
              }
            }
          });
          dataPayForExtendMoreDate.push(totalPayForExtendMoreInDate);
          dataPayForWork.push(totalPayForWorkInDate);
        }
        break;
    }
    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: this.dataLegend,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: this.dataXAxis,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: this.dataLegend[0],
          type: 'line',
          stack: 'counts',
          areaStyle: {},
          label: {
            show: true,
            position: 'top',
          },
          data: dataPayForWork,
        },
        {
          name: this.dataLegend[1],
          type: 'line',
          stack: 'counts',
          areaStyle: {},
          data: dataPayForExtendMoreDate,
        },
        {
          name: this.dataLegend[2],
          type: 'line',
          stack: 'counts',
          areaStyle: {},
          data: dataJobCreated,
        },
        {
          name: this.dataLegend[3],
          type: 'line',
          stack: 'counts',
          areaStyle: {},
          data: dataSubscribers,
        },
      ],
    };
    this.isLoadingChart = !this.isLoadingChart;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
