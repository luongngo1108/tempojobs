import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';
import { AddEditDatastateComponent } from './add-edit-datastate/add-edit-datastate.component';
import {DatastateService} from './datastate.service'

@Component({
  selector: 'app-datastate-management',
  templateUrl: './datastate-management.component.html',
  styleUrls: ['./datastate-management.component.scss']
})
export class DatastateManagementComponent {
  columns = [];
  @ViewChild('ngxTableUser', { static: true }) ngxTable: NgxTableComponent;
  addEditComponent = AddEditDatastateComponent;
  private destroy$: Subject<void> = new Subject<void>();
  user: any = {};
  constructor(
    private dataStateService: DatastateService,
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {
    this.columns = [
      {
        name: "dataStateName",
        prop: "dataStateName"
      },
      {
        name: 'type',
        prop: 'type'
      },
      {
        name: 'order',
        prop: 'order'
      },
      {
        name: 'colorCode',
        prop: 'colorCode'
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
    this.dataStateService.getAllDataState().subscribe(e => {
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
    this.dataStateService.onDeletes([rowData.dataStateId]).subscribe(res => {
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
    var deleteIds = deteleItem.map(x => x.dataStateId);
    this.dataStateService.onDeletes(deleteIds).subscribe(res => {
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
}
