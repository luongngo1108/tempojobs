import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { Subject, takeUntil, map } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { DataStateModel } from 'src/app/shared/models/data-state.model';
import { User } from '../../profile/user.model';
import { UserManagementService } from '../../profile/user-management.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'app-create-work',
  templateUrl: './create-work.component.html',
  styleUrls: ['./create-work.component.scss']
})
export class CreateWorkComponent implements OnInit, OnDestroy {
  frmCreateWork: FormGroup;
  workModel: WorkModel;
  createBy: any;
  listWorkType: DataStateModel[] = [];
  listProvince: any;
  listDistrict: any;
  matcher = new MyErrorStateMatcher();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private frmBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private dataStateService: DataStateManagementService,
    private router: Router,
    private userService: UserManagementService,
    private authService: NbAuthService,
  ) {
    this.workModel = new WorkModel();
  }

  ngOnInit(): void {
    this.frmCreateWork = this.frmBuilder.formGroup(WorkModel, this.workModel);
    this.dataStateService.getDataStateByType("WORK_TYPE").pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp.result) {
        this.listWorkType = resp.result;
      }
    });
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.createBy = token.getPayload();
        }
      });
    this.dataStateService.getListProvince().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp) {
        this.listProvince = resp;
      }
    });

    this.frmCreateWork.patchValue({
      quantity: this.workModel.quantity == null ? "0" : this.workModel.quantity,
      workHours: this.workModel.workHours == null ? "0" : this.workModel.workHours,
      workProfit: this.workModel.workProfit == null ? "0" : this.workModel.workProfit,
    });
    this.frmCreateWork.get('workProvince').valueChanges.subscribe((valueChanges) => {
      this.listProvince.map((province, index) => {
        if (province.codename === valueChanges) {
          this.listDistrict = this.listProvince[index].districts;
        }
      })
    });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  saveData() {
    if (this.frmCreateWork.valid) {
      const model: WorkModel = Object.assign({}, this.frmCreateWork.value);
      if (this.workModel.workId == null) {
        model.workId = 0;
      }
      if (this.createBy) {
        model.createdById = this.createBy.user.id;
        model.createdBy = this.createBy.user;
      }
      this.workService.saveWork(model).pipe(takeUntil(this.destroy$)).subscribe(resp => {
        if (resp.result) {
          this.workModel = resp.result;
          this.router.navigateByUrl('/');
        }
      });
    }
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}
