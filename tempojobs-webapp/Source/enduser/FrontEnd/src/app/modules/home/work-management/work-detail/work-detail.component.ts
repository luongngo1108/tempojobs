import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { GoogleMapLocation, ProfileDetail, User } from '../../profile/user.model';
import { UserManagementService } from '../../profile/user-management.service';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.component.html',
  styleUrls: ['./work-detail.component.scss']
})
export class WorkDetailComponent implements OnInit  {
  workModel: WorkModel;
  userDetailModel: ProfileDetail;
  constructor(
    private workService: WorkManagementService,
    private route: ActivatedRoute,
    private userService: UserManagementService,
    public dialog: MatDialog,
  ) {
    
  }

  async ngOnInit(): Promise<void> {
    var workId = this.route.snapshot.paramMap.get('workId');
    var res = await lastValueFrom(this.workService.getWorkByWorkId(workId));
    if(res.result) {
      this.workModel = res.result; 
      var detailRes = await lastValueFrom(this.userService.getUserDetailByUserId(this.workModel.createdBy.id));
      if(detailRes.result) this.userDetailModel = detailRes.result;
      console.log(this.userDetailModel);
    }
  }

  openUserDetailDialog(userId: string = "") {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      height: 'auto',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        userId: userId
      },
    });
  }
}
