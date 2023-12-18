import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { GoogleMapLocation, ProfileDetail, User } from '../../profile/user.model';
import { UserManagementService } from '../../profile/user-management.service';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { AppyWorkComponent } from './appy-work/appy-work.component';
import { NbToastrService } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { MessageService } from 'primeng/api';
import { WorkApply } from './appy-work/work-appy.model';
import { ReportComponent } from '../../report/report.component';

@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.component.html',
  styleUrls: ['./work-detail.component.scss']
})
export class WorkDetailComponent implements OnInit {
  workModel: WorkModel;
  userDetailModel: ProfileDetail;
  destroy$: Subject<void> = new Subject<void>();
  user: any = {};
  workApplied: WorkApply;

  constructor(
    private workService: WorkManagementService,
    private route: ActivatedRoute,
    private userService: UserManagementService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private authService: NbAuthService,
    private router: Router
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
        }
      });
  }

  async ngOnInit(): Promise<void> {
    var workId = this.route.snapshot.paramMap.get('workId');
    var res = await lastValueFrom(this.workService.getWorkByWorkId(Number(workId)));
    if (res.result) {
      this.workModel = res.result;
      this.workApplied = (await lastValueFrom(this.workService.getWorkApplyByWorkIdAndUserId(this.workModel.workId, this.user.user.id))).result;
      var detailRes = await lastValueFrom(this.userService.getUserDetailByUserId(this.workModel?.createdById || ""));
      if (detailRes.result) this.userDetailModel = detailRes.result;
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

  async openApplyForWorkDialog() {
    const dialogRef = this.dialog.open(AppyWorkComponent, {
      height: 'auto',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        workModel: this.workModel,
        workApplyModel: this.workApplied
      },
    });

    dialogRef.afterClosed().subscribe(async res => {
      if (res) {
        this.workApplied = (await lastValueFrom(this.workService.getWorkApplyByWorkIdAndUserId(this.workModel.workId, this.user.user.id))).result;
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Thành công',
          detail: `Bạn đăng đăng ký thành công. Vui lòng kiểm tra trong phần quản lý công việc đã đăng ký!`, life: 30000
        });
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openEditWork() {
    if (this.workModel) {
      this.router.navigate(['add-edit-work'], { state: { work: this.workModel } });
    }
  }

  openAppliedForWork() {
    this.router.navigateByUrl("created-manage");
  }

  openReport() {
    const dialogRef = this.dialog.open(ReportComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        workModel: this.workModel
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'success', summary: 'Thành công',
          detail: 'Cảm ơn! Chúng tôi sẽ liên hệ với bạn qua sớm nhất có thể!', life: 20000
        });
      }
    })
  }
}
