import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NbDateService } from '@nebular/theme';
import { lastValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PaymentType } from 'src/app/shared/enums/payment-type';
import { WorkModel } from 'src/app/shared/models/work.model';
import { PaymentServiceService } from 'src/app/shared/services/payment-service.service';
import { CalculateMoneyPayment } from 'src/app/shared/utility/Helper';

@Component({
  selector: 'app-extend-day-dialog',
  templateUrl: './extend-day-dialog.component.html',
  styleUrls: ['./extend-day-dialog.component.scss']
})
export class ExtendDayDialogComponent {
  minDate: Date = new Date();
  chooseDate: Date = null;
  workModel: WorkModel = new WorkModel();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ExtendDayDialogComponent>,
    protected dateService: NbDateService<Date>,
    private dialog: MatDialog,
    private paymentService: PaymentServiceService
  ) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate.setDate(currentDate.getDate() + 2));
  };

  ngOnInit(): void {
    if(this.data.workModel) this.workModel = this.data.workModel;
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  extendPayment() {
    const amount = CalculateMoneyPayment(this.chooseDate);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        content: `Bạn có chắc muốn tiếp tục thanh toán?`,
        nextButtonContent: "Thanh toán"
      },
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        var respCreatePayment = await lastValueFrom(this.paymentService.createMomoPayment({
          userEmail: this.workModel.createdBy.email, 
          inputAmount: amount, 
          workId: this.workModel.workId,
          paymentType: PaymentType.ExtendWork
        }));
        if (respCreatePayment.result) window.location.href = respCreatePayment.result;
      }
    })
  }
}
