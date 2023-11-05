import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit{
  @Input() tableResource;
  @Output() onRefresh = new EventEmitter<any>();
  @Input() addEditComponent: any;
  @Output() onDelete = new EventEmitter<any>();
  @Output() addEvent: EventEmitter<any> = new EventEmitter<any>();
  selectedCout: number = 0;
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

  }

  configClearFilter() {
    this.onRefresh.emit();
  }
}
