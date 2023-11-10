import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/modules/shared/components/confirm-modal/confirm-modal.component';
import { DataStateModel } from '../data-state.model';
import { DatastateService } from '../datastate.service';

@Component({
  selector: 'app-add-edit-datastate',
  templateUrl: './add-edit-datastate.component.html',
  styleUrls: ['./add-edit-datastate.component.scss']
})
export class AddEditDatastateComponent {
  dataSateModel: DataStateModel;
  form: FormGroup;
  submitted: boolean = false;
  isChange: boolean = false;
  destroy$: Subject<void> = new Subject<void>();
  action: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditDatastateComponent>,
    private formBuilder: RxFormBuilder,
    private dataStateService: DatastateService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    
  }

  ngOnInit(): void {
    this.action = this.data.action;
    if (this.data.model && this.action === "Edit") this.dataSateModel = this.data.model;
    if (!this.data.model && this.action === "Add") this.dataSateModel = new DataStateModel();
    this.form = this.formBuilder.formGroup(DataStateModel, this.dataSateModel);
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
          message: "Bạn có chắc muốn thoát? Tất cả nội dung sẽ mất."
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
    this.submitted = true;
    this.dataStateService.saveDataState(this.form.value).subscribe(res => {
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
