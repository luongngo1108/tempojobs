import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit{
  @Input() tableResource;
  @Output() onRefresh = new EventEmitter<any>();
  @Input() addEditComponent: any;
  @Output() onDeletes = new EventEmitter<any>();
  @Output() addEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedCout: number = 0;
  constructor(
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    
  }
  onClickAddNew() {
    const dialogRef = this.dialog.open(this.addEditComponent, {
      disableClose: true,
      height: '100vh',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      autoFocus: false,
      data: {
        action: 'Add'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response != null) {
        if (typeof response == "boolean") {
          this.onRefresh.emit(response)
          this.addEvent.emit(response);
        } else this.onRefresh.emit();
      }
    });
  }
  onClickDeletes() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        message: `Do you wish to delete ${this.selectedCout} item(s)?`
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.onDeletes.emit();
      }
    });
  }

  configClearFilter() {
    this.onRefresh.emit();
  }
}
