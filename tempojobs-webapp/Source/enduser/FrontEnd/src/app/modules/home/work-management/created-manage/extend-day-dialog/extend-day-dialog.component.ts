import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NbDateService } from '@nebular/theme';

@Component({
  selector: 'app-extend-day-dialog',
  templateUrl: './extend-day-dialog.component.html',
  styleUrls: ['./extend-day-dialog.component.scss']
})
export class ExtendDayDialogComponent {
  min: Date;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {userId: string},
    public dialogRef: MatDialogRef<ExtendDayDialogComponent>,
    protected dateService: NbDateService<Date>
  ) {
    this.min = this.dateService.addDay(this.dateService.today(), +1);
  };

  ngOnInit(): void {
    
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  extendPayment() {

  }
}
