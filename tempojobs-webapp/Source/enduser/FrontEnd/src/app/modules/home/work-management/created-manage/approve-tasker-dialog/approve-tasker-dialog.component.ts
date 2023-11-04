import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ProfileDetail } from '../../../profile/user.model';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';

@Component({
  selector: 'app-approve-tasker-dialog',
  templateUrl: './approve-tasker-dialog.component.html',
  styleUrls: ['./approve-tasker-dialog.component.scss']
})
export class ApproveTaskerDialogComponent implements OnInit {

  profile: ProfileDetail;
  acceptedId: number;
  refuseId: number;

  constructor(
    private dataStateService: DataStateManagementService,
    private workService: WorkManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.profile = data.profile ?? new ProfileDetail();
  }
  async ngOnInit() {
    var respAccept = await this.dataStateService.getDataStateByTypeAndName('WORK_APPLY_STATUS', 'Được nhận').toPromise();
    if (respAccept.result) {
      this.acceptedId = respAccept.result.dataStateId;
    }
    var respRefuse = await this.dataStateService.getDataStateByTypeAndName('WORK_APPLY_STATUS', 'Bị từ chối').toPromise();
    if (respRefuse.result) {
      this.acceptedId = respRefuse.result.dataStateId;
    }
  }

  saveWorkApplyStatus(status: number) {
    
  }
}
