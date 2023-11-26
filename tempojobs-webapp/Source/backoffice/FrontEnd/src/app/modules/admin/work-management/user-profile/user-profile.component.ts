import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ProfileDetail } from 'src/app/modules/shared/models/user.model';
import { UserManagementService } from '../../user-management/user-management.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userDetail: ProfileDetail;
  isLoading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {userId: string},
    private userService: UserManagementService,
    public dialogRef: MatDialogRef<UserProfileComponent>
  ) {

  };

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUserDetailByUserId(this.data.userId).subscribe(res => {
      if(res.result) this.userDetail = res.result;
      this.isLoading = false;
    })
  }

  closeDialog() {
    this.dialogRef.close(true);
  }
}
