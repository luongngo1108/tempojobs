import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { WorkModel } from 'src/app/shared/models/work.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkApply } from './work-appy.model';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'app-appy-work',
  templateUrl: './appy-work.component.html',
  styleUrls: ['./appy-work.component.scss']
})
export class AppyWorkComponent implements OnInit, OnDestroy {
  workModel: WorkModel;
  form: FormGroup;
  workApplyModel: WorkApply;
  isEdited: boolean = false;
  user: any = {};
  destroy$: Subject<void> = new Subject<void>();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {workModel: WorkModel},
    public dialogRef: MatDialogRef<AppyWorkComponent>,
    private formBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private dialog: MatDialog,
    private authService: NbAuthService
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
    .subscribe(async (token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
      }
    });
  };

  ngOnInit(): void {
    if(this.data.workModel) this.workModel = this.data.workModel;
    this.workApplyModel = new WorkApply();
    this.workApplyModel.userId = this.workModel.createdBy.id;
    this.workApplyModel.workId = this.workModel.workId;
    this.workApplyModel.status = 7;
    this.form = this.formBuilder.formGroup(WorkApply, this.workApplyModel);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); 
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
    this.workApplyModel.userId = this.user.user.id;
    this.workService.applyForWork(this.workApplyModel, this.user.user.id).subscribe(res => {
      if(res.result) this.dialogRef.close(true);
    })
  }
  inputChange(value: string) {
    if(!this.isEdited) this.isEdited = true;
  }
}
