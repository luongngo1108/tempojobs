import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ProfileDetail, User } from '../../../profile/user.model';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkApply } from '../../work-detail/appy-work/work-appy.model';
import { UserManagementService } from '../../../profile/user-management.service';
import { NbToastrService } from '@nebular/theme';
import { FormControl, FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-approve-tasker-dialog',
  templateUrl: './approve-tasker-dialog.component.html',
  styleUrls: ['./approve-tasker-dialog.component.scss']
})
export class ApproveTaskerDialogComponent implements OnInit {

  user: User;
  profile: ProfileDetail;
  forTab: number;
  work: WorkModel;
  workApply: WorkApply;

  waitingId: number;
  acceptedId: number;
  refuseId: number;
  evaluatedId: number;

  form: FormGroup;
  valueStar = 0;

  constructor(
    private dataStateService: DataStateManagementService,
    private workService: WorkManagementService,
    private userService: UserManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<ApproveTaskerDialogComponent>,
    private toast: NbToastrService,
    private formBuilder: RxFormBuilder,
  ) {
    this.user = data.user ?? new User();
    this.work = data.work ?? new WorkModel();
    this.forTab = data.tab ?? 0;
  }
  async ngOnInit() {
    this.form = new FormGroup({
      star: new FormControl()
    })
    var respProfile = await this.userService.getUserDetailByUserId(this.user._id).toPromise();
    if (respProfile.result) {
      this.profile = respProfile.result;
    }
    var respWorkApply = await this.workService.getWorkApplyByWorkIdAndUserId(this.work?.workId, this.user?._id).toPromise();
    if (respWorkApply.result) {
      this.workApply = respWorkApply.result;
    }
    var respWaiting = await this.dataStateService.getDataStateByTypeAndName('WORK_APPLY_STATUS', 'Đang đăng ký').toPromise();
    if (respWaiting.result) {
      this.waitingId = respWaiting?.result?.dataStateId;
    }
    var respAccept = await this.dataStateService.getDataStateByTypeAndName('WORK_APPLY_STATUS', 'Được nhận').toPromise();
    if (respAccept.result) {
      this.acceptedId = respAccept?.result?.dataStateId;
    }
    var respRefuse = await this.dataStateService.getDataStateByTypeAndName('WORK_APPLY_STATUS', 'Bị từ chối').toPromise();
    if (respRefuse.result) {
      this.refuseId = respRefuse?.result?.dataStateId;
    }
    var respEvaluated = await this.dataStateService.getDataStateByTypeAndName('WORK_APPLY_STATUS', 'Đã đánh giá').toPromise();
    if (respEvaluated.result) {
      this.evaluatedId = respEvaluated?.result?.dataStateId;
    }
  }

  closeDialog(data: boolean = false) {
    this.dialogRef.close(data);
  }

  saveWorkApplyStatus(status: number) {
    this.workApply.status = status;
    this.workService.saveWorkApply(this.workApply).subscribe(resp => {
      if (resp.result) {
        this.toast.success(`Xác nhận thành công`);
        this.closeDialog(true);
      } else {
        this.toast.success(`Xác nhận thất bại`);
        this.closeDialog(true);
      }
    });
  }

  saveWorkApplyStar() {
    this.workApply.star = this.form.get('star').value;
    this.workApply.status = this.evaluatedId;
    this.workService.saveWorkApply(this.workApply).subscribe(resp => {
      if (resp.result) {
        this.toast.success(`Xác nhận thành công`);
        this.closeDialog(true);
      } else {
        this.toast.success(`Xác nhận thất bại`);
        this.closeDialog();
      }
    });
  }
}
