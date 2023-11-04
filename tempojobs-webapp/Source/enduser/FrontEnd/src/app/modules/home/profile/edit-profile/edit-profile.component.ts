import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfileDetail, User } from '../user.model';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { UserManagementService } from '../user-management.service';
import { NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {
    this.frm = this.frmBuilder.formGroup(ProfileDetail, this.profileDetail);
    this.userFrm = this.frmBuilder.formGroup(User, this.user);
  }

  saveProfilDetail() {
    if (this.frm.controls.password.value != this.frm.controls.confirmPassword.value) {
      this.messageService.clear();
      this.messageService.add({
        key: 'toast1', severity: 'warn', summary: 'Lỗi',
        detail: `Mật khẩu không giống nhau!`, life: 20000
      });
      return;
    }
    this.submitted = true;
    this.userService.saveProfileDetail(this.frm.value).subscribe(res => {
      this.submitted = false;
      if (res.result) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Thành công',
          detail: `Thay đổi thông tin cá nhân thành công!`, life: 20000
        });
        this.updatedProfileDetail.emit(res.result);
      }
      else {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'warn', summary: 'Lỗi',
          detail: `Có lỗi xảy ra!`, life: 20000
        });
      }
    })
  }
}
