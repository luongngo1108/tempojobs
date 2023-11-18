import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { ProfileDetail, User } from '../../shared/models/user.model';
import { UserManagementService } from '../user-management/user-management.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  isOwnProfile: boolean = false;
  profileDetail: ProfileDetail;
  form: FormGroup;
  userFrm: FormGroup;
  submitted: boolean = false;
  isChange: boolean = false;
  user: any = {};
  destroy$: Subject<void> = new Subject<void>();
  action: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    private formBuilder: RxFormBuilder,
    private authService: NbAuthService,
    private userService: UserManagementService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
        }
      });
  }

  ngOnInit(): void {
    this.action = this.data.action;
    if (this.data.model && this.action === "Edit") this.profileDetail = this.data.model;
    if (!this.data.model && this.action === "Add") this.profileDetail = new ProfileDetail();
    if (this.data.isOwnProfile) this.isOwnProfile = this.data.isOwnProfile;
    this.form = this.formBuilder.formGroup(ProfileDetail, this.profileDetail);
    this.userFrm = this.formBuilder.formGroup(User, this.user);
    this.dialogRef.updatePosition({ right: '0' })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeDialog() {
    if (this.isChange) {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        backdropClass: 'custom-backdrop',
        hasBackdrop: true,
        data: {
          message: "Do you want to quit? unsaved data will be lost."
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.dialogRef.close(false);
        }
      })
    } else {
      this.dialogRef.close(false);
    }
  }

  saveData() {
    if (this.form.controls.password.value != this.form.controls.confirmPassword.value) {
      this.messageService.clear();
      this.messageService.add({
        key: 'toast1', severity: 'warn', summary: 'Lỗi',
        detail: `Mật khẩu không giống nhau!`, life: 20000
      });
      return;
    }
    this.submitted = true;
    this.userService.saveProfileDetail(this.form.value).subscribe(res => {
      this.submitted = false;
      if (res.result) {
        this.dialogRef.close(true);
      }
      else {
        if (!res.message) {
          this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'warn', summary: 'Lỗi',
            detail: `Có lỗi xảy ra!`, life: 20000
          });
        }
        else {
          this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'warn', summary: 'Lỗi',
            detail: `${res.message}`, life: 20000
          });
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => this.isChange = true);
  }
}
