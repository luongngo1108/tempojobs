import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { DataStateModel } from 'src/app/shared/models/data-state.model';

@Component({
  selector: 'app-create-work',
  templateUrl: './create-work.component.html',
  styleUrls: ['./create-work.component.scss']
})
export class CreateWorkComponent implements OnInit, OnDestroy {
  frmCreateWork: FormGroup;
  workModel: WorkModel;
  listWorkType: DataStateModel[] = [];
  matcher = new MyErrorStateMatcher();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private frmBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private dataStateService: DataStateManagementService,
    private router: Router,
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
    this.frmCreateWork.patchValue({
      quantity: this.workModel.quantity == null ? "0" : this.workModel.quantity,
      workHours: this.workModel.workHours == null ? "0" : this.workModel.workHours,
      workProfit: this.workModel.workProfit == null ? "0" : this.workModel.workProfit,
    });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  saveData() {
    if (this.frmCreateWork.valid) {
      const model: WorkModel = Object.assign({}, this.frmCreateWork.value);
      console.log(model);
      if (this.workModel.workId == null) {
        model.workId = 0;
        model.createdBy = '6519866887bacac6e15b3bec';
      }
      this.workService.saveWork(model).pipe(takeUntil(this.destroy$)).subscribe(resp => {
        if (resp.result) {
          this.workModel = resp.result;
          this.router.navigate(['/pages']);
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
