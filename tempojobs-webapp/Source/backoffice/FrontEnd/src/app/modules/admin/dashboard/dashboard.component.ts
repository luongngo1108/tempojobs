import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  columns = [];
  @ViewChild('ngxTable', { static: true }) ngxTable: NgxTableComponent;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private paymentService: PaymentService,
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {
    this.columns = [
      {
        name: 'payerId',
        prop: 'payerId'
      },
      {
        name: 'workId',
        prop: 'workId'
      },
      {
        name: 'amount',
        prop: 'amount'
      },
      {
        name: 'createdAt',
        prop: 'createdAt'
      },
      {
        name: 'updatedAt',
        prop: 'updatedAt'
      },
    ];
    this.refreshData();
  }

  refreshData(reset: boolean = false): void {
    this.paymentService.getAllPayment().subscribe(e => {
      console.log(e)
      this.ngxTable.setData(e);
    })
  }
}
