import { Component, ViewChild } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';
import { PagedData } from '../../shared/models/paged-data';
import { AddEditWorkComponent } from './add-edit-work/add-edit-work.component';
import { WorkService } from './work.service';

@Component({
  selector: 'app-work-management',
  templateUrl: './work-management.component.html',
  styleUrls: ['./work-management.component.scss']
})
export class WorkManagementComponent {
  columns = [];
  @ViewChild('ngxTable', { static: true }) ngxTable: NgxTableComponent;
  addEditComponent = AddEditWorkComponent;
  private destroy$: Subject<void> = new Subject<void>();
  user: any = {};
  constructor(
    private workService: WorkService,
    private messageService: MessageService,
    private authService: NbAuthService
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
    .subscribe(async (token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 

      }
    });

  }

  ngOnInit(): void {
    this.columns = [
      {
        name: "Name",
        prop: "workName"
      },
      {
        name: 'Province',
        prop: 'workProvince'
      },
      {
        name: 'District',
        prop: 'workDistrict'
      },
      {
        name: 'Address',
        prop: 'workAddress'
      },
      {
        name: 'Description',
        prop: 'workDescription'
      },
      {
        name: 'Start Date',
        prop: 'startDate'
      },
      {
        name: 'facebook',
        prop: 'facebook'
      },
      {
        name: 'Hours',
        prop: 'workHours'
      },
      {
        name: 'status',
        prop: 'workStatus.'
      },
      {
        name: 'address',
        prop: 'googleLocation.address'
      },
      {
        name: 'quantity',
        prop: 'quantity'
      }
    ];
    this.refreshData();
  }

  refreshData(reset: boolean = false): void {
    this.workService.getAllWork().subscribe(e => {
      var pageData = new PagedData();
      pageData.data = e.result;
      this.ngxTable.setData(pageData);
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
    this.workService.onDeletes([rowData.email]).subscribe(res => {
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
    var deleteEmails = deteleItem.map(x => x.email);
    this.workService.onDeletes(deleteEmails).subscribe(res => {
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
