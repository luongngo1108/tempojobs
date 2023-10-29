import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WorkModel } from 'src/app/shared/models/work.model';
import { ActivatedRoute } from '@angular/router';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { DataStateModel } from 'src/app/shared/models/data-state.model';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { NbToastrService } from '@nebular/theme';
import { PaymentServiceService } from 'src/app/shared/services/payment-service.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-created-manage',
  templateUrl: './created-manage.component.html',
  styleUrls: ['./created-manage.component.scss']
})
export class CreatedManageComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['workName', 'workTypeName', 'workProfit', 'workStatusName', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  listWork: WorkModel[] = [];
  listWorkType: DataStateModel[] = [];
  listWorkStatus: DataStateModel[] = [];
  paymentToken = null;
  paymentMessage = null;
  amount = null;
  userId = null;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private workService: WorkManagementService,
    private dataStateService: DataStateManagementService,
    private route: ActivatedRoute,
    private toast: NbToastrService,
    private paymentService: PaymentServiceService,
    private _location: Location
  ) {
    this.route.queryParams.subscribe(params => {
      this.paymentToken = params['paymentToken'];
      this.paymentMessage = params['message'];
      this.userId = params['userId'];
      this.amount = params['amount'];
    });
    this._location.go('created-manage');
  }

  async ngOnInit() {
    await this.getDataDefaults();
    if (this.paymentToken && this.paymentMessage.includes("Successful.") && this.userId) {
      this.paymentService.momoPayementSuccess({ paymentToken: this.paymentToken, amount: this.amount, userId: this.userId }).subscribe(res => {
        if (res.result) this.toast.success("Bạn đã thanh toán thành công!!", "Thanh toán thành công", { duration: 30000 });
      })
    }
    var resultListWork = await this.workService.getAllWork().pipe(takeUntil(this.destroy$)).toPromise();
    if (resultListWork.result) {
      this.listWork = resultListWork.result;
      this.listWork.map(work => {
        work.workStatusName = this.listWorkStatus.find(status => status.dataStateId === work.workStatusId)?.dataStateName;
        work.workTypeName = this.listWorkType.find(type => type.dataStateId === work.workTypeId)?.dataStateName;
      });
    }

  }

  async getDataDefaults() {
    var resultStatus = await this.dataStateService.getDataStateByType("WORK_STATUS").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultStatus.result) {
      this.listWorkStatus = resultStatus.result;
    }
    var resultType = await this.dataStateService.getDataStateByType("WORK_TYPE").pipe(takeUntil(this.destroy$)).toPromise();
    if (resultType.result) {
      this.listWorkType = resultType.result;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTab(event) {
    console.log(event);
  }

  async createPayment(workModel: any) {
    var startDate = new Date(workModel.startDate);
    var createdAt = new Date(workModel.createdAt);
    const diffTime = Math.abs(Number(startDate) - Number(createdAt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    var amount = diffDays * 5000 + workModel.quantity * 1000;
    var respCreatePayment = await lastValueFrom(this.paymentService.createMomoPayment({
      userEmail: workModel.createdBy.email, inputAmount: amount, workId: workModel.workId
    }));
    if (respCreatePayment.result) window.location.href = respCreatePayment.result;
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];