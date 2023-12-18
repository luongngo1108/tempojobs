import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';
import { AddEditWorkComponent } from '../work-management/add-edit-work/add-edit-work.component';
import { WorkService } from '../work-management/work.service';
import { AddEditReportComponent } from './add-edit-report/add-edit-report.component';
import { ReportService } from './report.service';

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.scss']
})
export class ReportManagementComponent {
  columns = [];
  @ViewChild('ngxTableUser', { static: true }) ngxTable: NgxTableComponent;
  @ViewChild('workCell', { static: true }) workCell: TemplateRef<any>;
  addEditComponent = AddEditReportComponent;
  private destroy$: Subject<void> = new Subject<void>();
  user: any = {};
  constructor(
    private reportService: ReportService,
    private messageService: MessageService,
    private workService: WorkService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.columns = [
      // {
      //   name: "user",
      //   prop: "userId"
      // },
      {
        name: 'Name',
        prop: 'fullName'
      },
      {
        name: 'email',
        prop: 'email'
      },
      {
        name: 'workId',
        prop: 'workId',
        cellTemplate: this.workCell
      },
      {
        name: 'phone',
        prop: 'phone'
      },
      {
        name: 'messsage',
        prop: 'message'
      },
      {
        name: 'createdAt',
        prop: 'createdAt'
      },
    ];
    this.refreshData();
  }

  refreshData(reset: boolean = false): void {
    this.reportService.getAllReport().subscribe(e => {
      this.ngxTable.setData(e);
    })
  }

  successEventEdit(event: any) {
    if (event) {
      this.messageService.clear();
      this.messageService.add({
        key: 'toast1', severity: 'success', summary: 'Success',
        detail: `Edit success!`, life: 2000
      });
    }
  }

  successEventAdd(event: any) {
    if (event) {
      this.messageService.clear();
      this.messageService.add({
        key: 'toast1', severity: 'success', summary: 'Success',
        detail: `Create new success!`, life: 2000
      });
    }
  }

  onClickDelete(event: any) {
    var rowData = event.row;
    this.reportService.onDeletes([rowData._id]).subscribe(res => {
      if (res.result) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Success',
          detail: `Delete succesfully!`, life: 2000
        });
        this.refreshData();
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'warn', summary: 'Warning',
          detail: `Delete unsuccesfully!`, life: 2000
        });
      }
    })
  }

  onClickDeletes(event: any) {
    var deteleItem = this.ngxTable.selected;
    var deleteIds = deteleItem.map(x => x._id);
    this.reportService.onDeletes(deleteIds).subscribe(res => {
      if (res.result) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Success',
          detail: `Delete succesfully!`, life: 2000
        });
        this.refreshData();
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'warn', summary: 'Warning',
          detail: `Delete unsuccesfully!`, life: 2000
        });
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
