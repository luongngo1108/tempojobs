import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { WorkModel } from '../../work.model';
import { WorkManagementService } from 'src/app/modules/shared/services/work-management.service';
import { ConfirmModalComponent } from 'src/app/modules/shared/components/confirm-modal/confirm-modal.component';
import { WorkApply, WorkApplyViewModel } from '../../work-apply-management/work-apply.model';
import { User } from 'src/app/modules/shared/models/user.model';
import { UserManagementService } from '../../../user-management/user-management.service';

@Component({
  selector: 'app-appy-work',
  templateUrl: './appy-work.component.html',
  styleUrls: ['./appy-work.component.scss']
})
export class AppyWorkComponent implements OnInit, OnDestroy, AfterViewInit {
  workModel: WorkModel;
  form: FormGroup;
  workApplyModel: WorkApply;
  isEdited: boolean = false;
  user: any = {};
  destroy$: Subject<void> = new Subject<void>();
  selectedUser: any;
  listUser: any[] = [];
  public userBankFilterCtrl: FormControl = new FormControl();
  public userFilteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  listWorkApplied: WorkApplyViewModel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AppyWorkComponent>,
    private formBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private dialog: MatDialog,
    private authService: NbAuthService,
    private userService: UserManagementService
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
        }
      });
  };

  ngOnInit(): void {
    if (this.data.workApplyModel) this.workApplyModel = this.data.workApplyModel;
    else this.workApplyModel = new WorkApply();
    if (this.data.workModel) this.workModel = this.data.workModel;
    if (this.data.listWorkApplied) this.listWorkApplied = this.data.listWorkApplied;
    this.workApplyModel.userId = this.workModel?.createdById;
    this.workApplyModel.workId = this.workModel?.workId;
    this.workApplyModel.status = 7;
    this.form = this.formBuilder.formGroup(WorkApply, this.workApplyModel);
    this.userService.getAllUserExceptEmailAndAdmin(this.user.user.email).subscribe(e => {
      this.listUser = e.data;
      this.listUser = this.listUser.filter((user) => {
        return (
          this.listWorkApplied.filter(x => x.workApply.userId == user._id).length === 0
        );
      })
      console.log(this.listUser);
      this.userFilteredBanks.next(this.listUser);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.userBankFilterCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe(() => {
        this.userfilterBanks();
      });
  }

  protected userfilterBanks() {
    if (!this.listUser) {
      return;
    }

    let search = this.userBankFilterCtrl.value;
    if (!search) {
      this.userFilteredBanks.next(this.listUser.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.userFilteredBanks.next(
      this.listUser.filter((user) => {
        const searchLowerCase = search.toLowerCase();
        return (
          (user?.displayName?.toLowerCase()?.trim()?.indexOf(searchLowerCase) > -1 ||
          user?.email?.toLowerCase()?.trim()?.indexOf(searchLowerCase) > -1) &&
          this.listWorkApplied.filter(x => x.userId == user._id).length === 0
        );
      })
    );
  }

  closeDialog() {
    if (this.isEdited) {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        backdropClass: 'custom-backdrop',
        hasBackdrop: true,
        data: {
          message: "All unsaved will be lost?"
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

  onApplyForWork() {
    this.workApplyModel.userId = this.selectedUser;
    this.workService.applyForWork(this.workApplyModel, this.selectedUser).subscribe(res => {
      if (res.result) this.dialogRef.close(true);
    })
  }
  inputChange(value: string) {
    if (!this.isEdited) this.isEdited = true;
  }
}
