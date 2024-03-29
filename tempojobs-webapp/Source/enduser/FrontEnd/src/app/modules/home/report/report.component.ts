import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ProfileDetail } from '../profile/user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserManagementService } from '../profile/user-management.service';
import { FormGroup } from '@angular/forms';
import { Report } from './report.model';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject, takeUntil, lastValueFrom } from 'rxjs';
import { ReportService } from './report.service';
import { NbToastrService } from '@nebular/theme';
import { MessageService } from 'primeng/api';
import { WorkModel } from 'src/app/shared/models/work.model';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
  formReport: FormGroup;
  reportModel: Report;
  isLoading: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  user: any =null;
  userDetail: ProfileDetail;
  workModel: WorkModel
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserManagementService,
    public dialogRef: MatDialogRef<ReportComponent>,
    private formBuilder: RxFormBuilder,
    private authService: NbAuthService,
    private reportService: ReportService,
    private messageService: MessageService
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
        }
      });
  }

  async ngOnInit(): Promise<void> {
    if(this.data.workModel) this.workModel = this.data.workModel;
    if(this.user) {
      var res = await lastValueFrom(this.userService.getUserDetailByUserId(this.user.user.id));
      if (res.result) this.userDetail = res.result;;
    }
    if (!this.reportModel) this.reportModel = new Report();
    this.reportModel._id = null
    if (this.user?.user && this.userDetail) {
      this.reportModel.userId = this.user.user.id;
      this.reportModel.email = this.user.user.email;
      this.reportModel.phone = this.userDetail?.phone;
      this.reportModel.fullName = `${this.userDetail?.firstName} ${this.userDetail?.lastName}`;
    }
    this.reportModel.workId = this.workModel.workId;
    this.formReport = this.formBuilder.formGroup(Report, this.reportModel);
  }

  sendRport() {
    this.isLoading = true;
    this.reportService.saveReport(this.reportModel).subscribe(res => {
      if (res.result) {
        this.isLoading = false;
        this.dialogRef.close(true);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
