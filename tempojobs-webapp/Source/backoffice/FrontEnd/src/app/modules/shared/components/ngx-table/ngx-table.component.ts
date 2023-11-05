import { Component, Input, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Page } from '../../models/page';
import { PagedData } from '../../models/paged-data';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-ngx-table',
  templateUrl: './ngx-table.component.html',
  styleUrls: ['./ngx-table.component.scss']
})
export class NgxTableComponent implements OnInit {
  @ViewChild('columnAction', { static: true }) columnAction: TemplateRef<any>;
  @Input() actionWidth = 70;
  @Output() onRefresh = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() editEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() columnsTable: [];
  @Input() addEditComponent: any;
  isLoading = 0;
  rows = [];
  columns = [];
  ColumnMode: ColumnMode;
  page = new Page();
  selected = [];
  table;
  SelectionType = SelectionType;
  actionColumn = [];
  constructor(
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.actionColumn.push({
      width: 30,
      sortable: false,
      canAutoResize: false,
      draggable: false,
      resizeable: false,
      headerCheckboxable: true,
      checkboxable: true,
      headerClass: 'text-center',
      cellClass: 'text-center',
      frozenLeft: true,
    });
    this.actionColumn.push({
      maxWidth: this.actionWidth,
      name: '',
      prop: 'actionNgxTable', // old name = 'id' => change to new name actionNgxTable
      sortable: false,
      cellTemplate: this.columnAction,
      headerClass: 'text-center remove-padding',
      cellClass: 'text-center remove-padding',
      frozenLeft: true,
    });
    this.columns = this.columns.concat(this.actionColumn);
    this.columns = this.columns.concat(this.columnsTable);
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  setData(result: PagedData<any>) {
    if (result) {
      this.isLoading--;
      this.page = result.page;
      this.rows = result.data;
      if(!result.data) this.table.offset = Number.POSITIVE_INFINITY;
      setTimeout(() => {
        if (this.selected && this.selected.length > 0) {
          const compareEqual = this.rows.filter(x => this.selected.map(y => JSON.stringify(y)).includes(JSON.stringify(x)));
          if (compareEqual && compareEqual.length > 0) {
            const compareDifferent = this.selected.filter(x => !compareEqual.map(y => JSON.stringify(y)).includes(JSON.stringify(x)));
            this.selected = [...compareEqual, ...compareDifferent];
          }
        }
      }, 1);
    }
  }
  onClickEdit(row, rowIndex) {
    const dialogRef = this.dialog.open(this.addEditComponent, {
      disableClose: true,
      height: '100vh',
      width: '600px',
      panelClass: 'dialog-detail',
      autoFocus: false,
      data: {
        model: row,
        action: 'Edit'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response != null) {
        if (typeof response == "boolean") {
          this.refreshTable(response)
          this.editEvent.emit();
        } else this.refreshTable();
      }
    });
  }

  refreshTable(reset: boolean = false) {
    this.onRefresh.emit();
  }

  onClickDelete(row, rowIndex) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        message: 'Do you wish to delete this item?'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.onDelete.emit({
          row: row,
          rowIndex: rowIndex
        });
      }
    });
  }
}
