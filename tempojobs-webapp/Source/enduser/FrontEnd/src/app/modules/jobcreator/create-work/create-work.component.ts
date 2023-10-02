import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkTypeModel } from 'src/app/shared/models/work-type.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-work',
  templateUrl: './create-work.component.html',
  styleUrls: ['./create-work.component.scss']
})
export class CreateWorkComponent implements OnInit, OnDestroy {
  frmCreateWork: FormGroup;
  workModel: WorkModel;
  listWorkType: WorkTypeModel[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private frmBuilder: RxFormBuilder,
    private workService: WorkManagementService,
  ) {
    this.workModel = new WorkModel();
  }

  ngOnInit(): void {
    this.frmCreateWork = this.frmBuilder.formGroup(WorkModel, this.workModel);
    this.workService.getAllWorkType().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp.result) {
        this.listWorkType = resp.result;
      }
    })
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  saveData() {
    if (this.frmCreateWork.valid) {
      const model: WorkModel = Object.assign({}, this.frmCreateWork.value);
      console.log(model);
    }
  }
}
