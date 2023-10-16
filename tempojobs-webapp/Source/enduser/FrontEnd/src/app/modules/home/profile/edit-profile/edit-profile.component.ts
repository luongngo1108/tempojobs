import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfileDetail, User } from '../user.model';
import {  FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { UserManagementService } from '../user-management.service';
import { NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @Input() profileDetail;
  @Input() user;
  @Output() updatedProfileDetail = new EventEmitter<ProfileDetail>();
  frm: FormGroup;
  userFrm: FormGroup;
  submitted: boolean = false;
  logicalPositions = NbGlobalLogicalPosition;
  constructor(
    private frmBuilder: RxFormBuilder,
    private userService: UserManagementService,
    private toast: NbToastrService
    ) {
      
  }
  
  ngOnInit(): void {
    this.frm = this.frmBuilder.formGroup(ProfileDetail, this.profileDetail);
    this.userFrm = this.frmBuilder.formGroup(User, this.user);
    console.log(this.frm);
  }

  saveProfilDetail() {  
    if(this.frm.controls.password.value != this.frm.controls.confirmPassword.value) {
      this.toast.danger("Please enter confirm password correctly!!", "", {position: this.logicalPositions.BOTTOM_END});
      return;
    }
    this.submitted = true;
    this.userService.saveProfileDetail(this.frm.value).subscribe(res => {
      this.submitted = false;
      if(res.result) {
        this.toast.success("Saved succesfully!!", "", {position: this.logicalPositions.BOTTOM_END});
        this.updatedProfileDetail.emit(res.result);
      } 
      else this.toast.warning("Some error happened!!", "", {position: this.logicalPositions.BOTTOM_END})
    })
  }
}
