import { Component, Inject, Input, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  content: string = "Bạn có muốn tiếp tục?"
  nextButtonContent: string = "Tiếp tục"

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string},
  public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { 
    if(data['content']) this.content = data['content'];
    if(data['nextButtonContent']) this.nextButtonContent = data['nextButtonContent'];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onNextClick(): void {
    this.dialogRef.close(true);
  }
  ngOnInit(): void {
    
  }
}
