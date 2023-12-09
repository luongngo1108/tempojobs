import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/@core/mock/users.service';
import { DataStateModel } from '../../datastate-management/data-state.model';
import { DatastateService } from '../../datastate-management/datastate.service';
import { UserManagementService } from '../../user-management/user-management.service';
import { ApproveTaskerDialogComponent } from '../approve-tasker-dialog/approve-tasker-dialog.component';
import { WorkApply, WorkApplyViewModel } from '../work-apply-management/work-apply.model';
import { WorkApplyService } from '../work-apply-management/work-apply.service';
import { WorkModel } from '../work.model';
import { WorkService } from '../work.service';
import { AppyWorkComponent } from './appy-work/appy-work.component';

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
    private dataStateService: DatastateService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private userService: UserManagementService,
    private workService: WorkService
  ) {

  }

  ngOnInit(): void {
    if(this.data.model) this.workModel = this.data.model;
    this.workApplyService.getAllWorkApplByWorkId(this.workModel.workId).subscribe(res => {
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

  changeStatus(statusId: any, workApply: WorkApply) {
    if(statusId && workApply) {
      workApply.status = statusId;
      this.workApplyService.saveWorkApply(workApply).subscribe(res => {
        if(res.result) {
          var extendMessage = "";
          if(statusId === 9 || statusId === 8) extendMessage = "Notification has been sent to the user";
          this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'success', summary: 'Success',
            detail: `Change work apply status successfully! ${extendMessage}`, life: 4000
          });
        }
      })
    }
  }

  deleteWorkApply(workApply: WorkApply) {
    this.workApplyService.deleteWorkApplyNotSendNoti(workApply).subscribe(res => {
      if(res.result) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Success',
          detail: `Remove work apply successfully! Notification has been sent to the user`, life: 4000
        });
        this.workApplyService.getAllWorkApplByWorkId(this.workModel.workId).subscribe(res => {
          if(res.result) {
            this.listWorkApplyViewModel = res.result;
          }
        })
      }
    })
  }

  async openWorkApplyDetail(workApply: WorkApply) {
    var userResult =  (await lastValueFrom(this.userService.getUserByUserId(workApply.userId))).result;
    var workResult =  (await lastValueFrom(this.workService.getWorkByWorkId(workApply.workId))).result;
    let dialogRef = this.dialog.open(ApproveTaskerDialogComponent, {
      disableClose: false,
      width: '500px',
      autoFocus: false,
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        user: userResult,
        work: workResult
      }
    });
  }

  async addTaskerToWork() {
    const dialogRef = this.dialog.open(AppyWorkComponent, {
      height: 'auto',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        workModel: this.workModel,
        listWorkApplied: this.listWorkApplyViewModel
      },
    });

    dialogRef.afterClosed().subscribe(async res => {
      if (res) {
        this.workApplyService.getAllWorkApplByWorkId(this.workModel.workId).subscribe(res => {
          if(res.result) {
            this.listWorkApplyViewModel = res.result;
          }
        })
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Success',
          detail: `Add work apply successfully!`, life: 30000
        });
      }
    })
  }
}
