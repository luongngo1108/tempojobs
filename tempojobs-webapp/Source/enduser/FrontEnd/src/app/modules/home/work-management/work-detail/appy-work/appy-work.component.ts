import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { WorkModel } from 'src/app/shared/models/work.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkApply } from './work-appy.model';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-appy-work',
  templateUrl: './appy-work.component.html',
  styleUrls: ['./appy-work.component.scss']
})
export class AppyWorkComponent {
  workModel: WorkModel;
  form: FormGroup;
  workApplyModel: WorkApply;
  isEdited: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {workModel: WorkModel},
    public dialogRef: MatDialogRef<AppyWorkComponent>,
    private formBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private dialog: MatDialog
  ) {

  };

  ngOnInit(): void {
    if(this.data.workModel) this.workModel = this.data.workModel;
    this.workApplyModel = new WorkApply();
    this.workApplyModel.userId = this.workModel.createdBy.id;
    this.workApplyModel.workId = this.workModel.workId;
    this.workApplyModel.status = 1;
    this.form = this.formBuilder.formGroup(WorkApply, this.workApplyModel);
  }

  closeDialog() {
    if(this.isEdited) {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        backdropClass: 'custom-backdrop',
        hasBackdrop: true,
        data: {
          message: "Bạn có chắc muốn hủy đăng ký?"
        }
      });
  
      dialogRef.afterClosed().subscribe(res => {
        if(res) {
          this.dialogRef.close(false);
        }
      })
    } else {
      this.dialogRef.close(false);
    }
  }

  onApplyForWork() {
    this.workService.applyForWork(this.workApplyModel).subscribe(res => {
      if(res.result) this.dialogRef.close(true);
    })
  }
  inputChange(value: string) {
    if(!this.isEdited) this.isEdited = true;
  }
}
