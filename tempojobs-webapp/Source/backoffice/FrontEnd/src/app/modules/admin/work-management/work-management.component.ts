import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { MessageService } from 'primeng/api';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { NgxTableComponent } from '../../shared/components/ngx-table/ngx-table.component';
import { PagedData } from '../../shared/models/paged-data';
import { DatePipePipe } from '../../shared/pipes/date-pipe.pipe';
import { DataStateModel } from '../datastate-management/data-state.model';
import { DatastateService } from '../datastate-management/datastate.service';
import { UserManagementService } from '../user-management/user-management.service';
import { AddEditWorkComponent } from './add-edit-work/add-edit-work.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WorkService } from './work.service';

@Component({
  selector: 'app-work-management',
  templateUrl: './work-management.component.html',
  styleUrls: ['./work-management.component.scss']
})
export class WorkManagementComponent {
  columns = [];
  @ViewChild('ngxTable', { static: true }) ngxTable: NgxTableComponent;
  @ViewChild('statusCell', { static: true }) statusCell: TemplateRef<any>;
  @ViewChild('userCell', { static: true }) userCell: TemplateRef<any>;
  addEditComponent = AddEditWorkComponent;
  private destroy$: Subject<void> = new Subject<void>();
  user: any = {};
  listStatus: any = null;
  constructor(
    private workService: WorkService,
    private messageService: MessageService,
    private authService: NbAuthService,
    private datePipe: DatePipePipe,
    private datastateService: DatastateService,
    private userService: UserManagementService,
    public dialog: MatDialog,

  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
    .subscribe(async (token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 

      }
    });

    this.datastateService.getAllDataState().subscribe(res => {
      if(res.data) {
        this.listStatus = res.data;
      }
    })

  }

  ngOnInit(): void {
    this.columns = [
      {
        name: "workId",
        prop: "workId"
      },
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
        prop: 'startDate',
        pipe: this.datePipe
      },
      {
        name: 'Hours',
        prop: 'workHours'
      },
      {
        name: 'status',
        prop: 'workStatusId',
        cellTemplate: this.statusCell,
        cellClass: 'text-center',
      },
      {
        name: 'type',
        prop: 'workTypeId'
      },
      {
        name: 'Google address',
        prop: 'googleLocation.address'
      },
      {
        name: 'Owner',
        prop: 'createdBy.firstName',
        cellTemplate: this.userCell
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
    this.workService.onDeletes([rowData.workId]).subscribe(res => {
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
    var deleteIds = deteleItem.map(x => x.workId);
    this.workService.onDeletes(deleteIds).subscribe(res => {
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

  handleDisplayStatus(state: number, isDisplayColor: boolean = false): string {
    if (this.listStatus?.length <= 0) {
      return isDisplayColor ? '#0000' : '';
    }
    if (state) {
      if (isDisplayColor) {
        var findColor = this.listStatus.find(x => x.dataStateId === state);
        if (findColor) return findColor.colorCode;
        else return '#0000';
      }
      else {
        var findName = this.listStatus.find(x => x.dataStateId === state);
        if (findName) return findName.dataStateName;
        else return '';
      }
    }
  }

  openUserDetail(row) {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      height: 'auto',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        userId: row.createdById
      },
    });
  }
}
