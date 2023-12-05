import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';
import { UserProfileComponent } from '../work-management/user-profile/user-profile.component';
import { WorkService } from '../work-management/work.service';
import { PaymentService } from './payment.service';
import { AddEditWorkComponent } from '../work-management/add-edit-work/add-edit-work.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  columns = [];
  @ViewChild('ngxTable', { static: true }) ngxTable: NgxTableComponent;
  @ViewChild('userCell', { static: true }) userCell: TemplateRef<any>;
  @ViewChild('paymentTypeCell', { static: true }) paymentTypeCell: TemplateRef<any>;
  @ViewChild('workCell', { static: true }) workCell: TemplateRef<any>;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private paymentService: PaymentService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private workService: WorkService
  ) {

  }

  ngOnInit(): void {
    this.columns = [
      {
        name: 'payerId',
        prop: 'payerId',
        cellTemplate: this.userCell
      },
      {
        name: 'workId',
        prop: 'workId',
        cellTemplate: this.workCell,
        cellClass: 'text-center'
      },
      {
        name: 'amount',
        prop: 'amount'
      },
      {
        name: 'Type',
        prop: 'paymentType',
        cellTemplate: this.paymentTypeCell
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
      this.ngxTable.setData(e);
    })
  }

  openUserDetail(row) {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      height: 'auto',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        userId: row.payerId
      },
    });
  }

  openWorkDetail(row) {
    this.workService.getWorkByWorkId(row.workId).subscribe(res => {
      if(res.result) {
        const dialogRef = this.dialog.open(AddEditWorkComponent, {
          height: 'auto',
          width: '900px',
          backdropClass: 'custom-backdrop',
          hasBackdrop: true,
          data: {
            model: res.result,
            action: 'Edit'
          },
        });
      }
    })
  }
}
