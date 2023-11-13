import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/modules/shared/components/confirm-modal/confirm-modal.component';
import { Report } from '../report.model';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-add-edit-report',
  templateUrl: './add-edit-report.component.html',
  styleUrls: ['./add-edit-report.component.scss']
})
export class AddEditReportComponent {
  reportModel: Report;
  form: FormGroup;
  submitted: boolean = false;
  isChange: boolean = false;
  destroy$: Subject<void> = new Subject<void>();
  action: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditReportComponent>,
    private formBuilder: RxFormBuilder,
    private reportService: ReportService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    
  }

  ngOnInit(): void {
    this.action = this.data.action;
    if (this.data.model && this.action === "Edit") this.reportModel = this.data.model;
    if (!this.data.model && this.action === "Add") this.reportModel = new Report();
    this.form = this.formBuilder.formGroup(Report, this.reportModel);
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
    this.submitted = true;
    this.reportService.saveReport(this.form.value).subscribe(res => {
      this.submitted = false;
      if (res.result) {
        this.dialogRef.close(true);
      }
      else {
        if (!res.message) {
          this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'warn', summary: 'Lỗi',
            detail: `Error!`, life: 20000
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
