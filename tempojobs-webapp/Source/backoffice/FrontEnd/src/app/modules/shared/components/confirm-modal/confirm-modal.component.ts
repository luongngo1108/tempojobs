import { Component, Inject, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
 
  message = "";
  falseTitle = "No";
  yesTitle = "Yes";
  zIndex = 1000;
  isDisabled = false;
  externalTemplate: TemplateRef<any>;
  alternateTitle = null;
  alternateReturnData: any = null;
  constructor(private dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data?.message || this.data?.externalTemplate) {
      this.message = this.data?.message || this.message;
      this.falseTitle = this.data?.falseTitle || this.falseTitle;
      this.yesTitle = this.data?.yesTitle || this.yesTitle;
      this.zIndex = this.data?.zIndex || this.zIndex;
      this.isDisabled = this.data?.isDisabled || this.isDisabled;
      this.alternateTitle = this.data?.alternateTitle || this.alternateTitle;
      this.alternateReturnData = this.data?.alternateReturnData || this.alternateReturnData;
      this.externalTemplate = this.data?.externalTemplate || this.externalTemplate;
    }

    this.dialogRef.afterOpened().subscribe(res => {
      if (this.dialogRef) {
        var overlayConfirmClosed = window.document.querySelector<any>('.custom-z-index-confirm');
        if (overlayConfirmClosed) overlayConfirmClosed.parentNode.style.zIndex = this.zIndex;
      }
    });
  }
}
