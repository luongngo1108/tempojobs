import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ProfileDetail, User } from '../../../profile/user.model';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkApply } from '../../work-detail/appy-work/work-appy.model';
import { UserManagementService } from '../../../profile/user-management.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-approve-tasker-dialog',
  templateUrl: './approve-tasker-dialog.component.html',
  styleUrls: ['./approve-tasker-dialog.component.scss']
})
export class ApproveTaskerDialogComponent implements OnInit {

  user: User;
  profile: ProfileDetail;
  work: WorkModel;
  workApply: WorkApply;
  acceptedId: number;
  refuseId: number;

  constructor(
    private dataStateService: DataStateManagementService,
    private workService: WorkManagementService,
    private userService: UserManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<ApproveTaskerDialogComponent>,
    private toast: NbToastrService,
  ) {
    this.user = data.user ?? new User();
    this.work = data.work ?? new WorkModel();
  }
  async ngOnInit() {
    var respProfile = await this.userService.getUserDetailByUserId(this.user._id).toPromise();
    if (respProfile.result) {
      this.profile = respProfile.result;
    }
    var respWorkApply = await this.workService.getWorkApplyByWorkIdAndUserId(this.work?.workId, this.user?._id).toPromise();
    if (respWorkApply.result) {
      this.workApply = respWorkApply.result;
    }
    var respAccept = await this.dataStateService.getDataStateByTypeAndName('WORK_APPLY_STATUS', 'Được nhận').toPromise();
    if (respAccept.result) {
      this.acceptedId = respAccept.result.dataStateId;
    }
    var respRefuse = await this.dataStateService.getDataStateByTypeAndName('WORK_APPLY_STATUS', 'Bị từ chối').toPromise();
    if (respRefuse.result) {
      this.refuseId = respRefuse.result.dataStateId;
    }
  }

  closeDialog(data: boolean = false) {
    this.dialogRef.close(data);
  }

  saveWorkApplyStatus(status: number) {
    this.workApply.status = status;
    this.workService.changeStatusWorkApply(this.workApply).subscribe(resp => {
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
