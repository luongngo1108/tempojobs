import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/@core/mock/users.service';
import { WorkModel } from 'src/app/shared/models/work.model';
import { DataStateModel } from 'src/app/shared/models/data-state.model';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { UserManagementService } from '../../../profile/user-management.service';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { ApproveTaskerDialogComponent } from '../approve-tasker-dialog/approve-tasker-dialog.component';
import { WorkApplyService } from './work-apply.service';
import { WorkApply, WorkApplyViewModel } from '../../work-detail/appy-work/work-appy.model';

@Component({
  selector: 'app-work-apply-dialog',
  templateUrl: './work-apply-dialog.component.html',
  styleUrls: ['./work-apply-dialog.component.scss']
})
export class WorkApplyDialogComponent implements OnInit {
  workModel: WorkModel;
  listWorkApplyViewModel: WorkApplyViewModel[] =[];
  listWorkApplyStatus: DataStateModel[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WorkApplyDialogComponent>,
    private workApplyService: WorkApplyService,
    private dataStateService: DataStateManagementService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private userService: UserManagementService,
    private workService: WorkManagementService
  ) {

  }

  ngOnInit(): void {
    if(this.data.model) this.workModel = this.data.model;
    this.workApplyService.getAllWorkApplByWorkId(this.workModel?.workId).subscribe(res => {
      if(res.result) {
        this.listWorkApplyViewModel = res.result;
      }
    })

    this.dataStateService.getDataStateByType("WORK_APPLY_STATUS").subscribe(res => {
      if(res.result) {
        this.listWorkApplyStatus = res.result;
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  async openWorkApplyDetail(workApply: WorkApply) {
    var userResult =  (await lastValueFrom(this.userService.getUserByUserId(workApply?.userId))).result;
    var workResult =  (await lastValueFrom(this.workService.getWorkByWorkId(workApply?.workId))).result;
    let dialogRef = this.dialog.open(ApproveTaskerDialogComponent, {
      disableClose: false,
      width: '500px',
      autoFocus: false,
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        user: userResult,
        work: workResult,
        tab: 2
      }
    });
  }
}
