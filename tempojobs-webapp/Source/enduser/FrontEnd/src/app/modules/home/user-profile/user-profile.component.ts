import { Component, Inject, OnInit } from '@angular/core';
import { ProfileDetail } from '../profile/user.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UserManagementService } from '../profile/user-management.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userDetail: ProfileDetail;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {userId: string},
    private userService: UserManagementService,
    public dialogRef: MatDialogRef<UserProfileComponent>
  ) {

  };

  ngOnInit(): void {
    this.userService.getUserDetailByUserId(this.data.userId).subscribe(res => {
      if(res.result) this.userDetail = res.result;
    })
  }

  closeDialog() {
    this.dialogRef.close(true);
  }
}
