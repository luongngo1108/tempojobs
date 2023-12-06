import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WorkApplyViewModel } from '../work-apply-management/work-apply.model';
import { WorkApplyService } from '../work-apply-management/work-apply.service';
import { WorkModel } from '../work.model';

@Component({
  selector: 'app-work-apply-dialog',
  templateUrl: './work-apply-dialog.component.html',
  styleUrls: ['./work-apply-dialog.component.scss']
})
export class WorkApplyDialogComponent implements OnInit {
  workModel: WorkModel;
  listWorkApplyViewModel: WorkApplyViewModel[] =[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WorkApplyDialogComponent>,
    private workApplyService: WorkApplyService
  ) {

  }

  ngOnInit(): void {
    if(this.data.model) this.workModel = this.data.model;
    this.workApplyService.getAllWorkApplByWorkId(this.workModel.workId).subscribe(res => {
      if(res.result) {
        this.listWorkApplyViewModel = res.result;
        console.log(this.listWorkApplyViewModel);
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  addUser() {

  }
}
