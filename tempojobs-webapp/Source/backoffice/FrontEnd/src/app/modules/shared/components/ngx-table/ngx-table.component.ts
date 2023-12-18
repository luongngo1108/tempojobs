import { Component, Input, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Page } from '../../models/page';
import { PagedData } from '../../models/paged-data';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Filter } from './filter.model';

@Component({
  selector: 'app-ngx-table',
  templateUrl: './ngx-table.component.html',
  styleUrls: ['./ngx-table.component.scss']
})
export class NgxTableComponent implements OnInit {
  @ViewChild('columnAction', { static: true }) columnAction: TemplateRef<any>;
  @ViewChild('headerFilter', { static: true }) headerFilter: TemplateRef<any>;
  @ViewChild('dateCell', { static: true }) dateCell: TemplateRef<any>;
  @ViewChild('colorCodeCell', { static: true }) colorCodeCell: TemplateRef<any>;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Input() actionWidth = 70;
  @Output() onRefresh = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() editEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() columnsTable: [];
  @Input() addEditComponent: any;
  @Input() isNormalShowTable: boolean = false;
  @Input() addEditHeight: string = '100vh';
  @Input() addEditWidth: string = '600px';
  isLoading = 0;
  rows = [];
  columns = [];
  ColumnMode: ColumnMode;
  page = new Page();
  selected = [];
  SelectionType = SelectionType;
  actionColumn = [];
  listFilter = [];
  rawData = [];
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
      prop: 'id',
      sortable: false,
      cellTemplate: this.columnAction,
      headerClass: 'text-center remove-padding',
      cellClass: 'text-center remove-padding',
      frozenLeft: true,
    });
    if(!this.isNormalShowTable) {
      this.columns = this.columns.concat(this.actionColumn);
    }
    var lstDatePipe = ['birth', 'createdAt','updatedAt'];
    if (this.columnsTable && this.columnsTable.length > 0) {
      this.columnsTable.forEach((column: any, index) => {
        if (!column.headerTemplate) {
          column.headerTemplate = this.headerFilter;
        }
        if(lstDatePipe.includes(column.prop)) {
          column.cellTemplate = this.dateCell;
        }
        if(column.prop === 'colorCode') {
          column.cellTemplate = this.colorCodeCell;
          column.cellClass = 'text-center remove-padding';
        }
      })
    }
    this.columns = this.columns.concat(this.columnsTable);
  }

  onSelect({ selected }) {
    if(this.selected.length > 0 && selected.length>0) {
      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
    }
  }

  setData(result: PagedData<any>) {
    if (result) {
      this.isLoading--;
      this.page = result.page;
      this.rows = result.data;
      this.rawData = result.data;
      this.listFilter = [];
      // if (!result.data) this.table.offset = Number.POSITIVE_INFINITY;
      // setTimeout(() => {
      //   if (this.selected && this.selected.length > 0) {
      //     const compareEqual = this.rows.filter(x => this.selected.map(y => JSON.stringify(y)).includes(JSON.stringify(x)));
      //     if (compareEqual && compareEqual.length > 0) {
      //       const compareDifferent = this.selected.filter(x => !compareEqual.map(y => JSON.stringify(y)).includes(JSON.stringify(x)));
      //       this.selected = [...compareEqual, ...compareDifferent];
      //     }
      //   }
      // }, 1);
    }
  }
  onClickEdit(row, rowIndex) {
    const dialogRef = this.dialog.open(this.addEditComponent, {
      disableClose: true,
      height: this.addEditHeight,
      width: this.addEditWidth,
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
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
          this.editEvent.emit(response);
        } else this.refreshTable();
      }
    });
  }

  refreshTable(reset: boolean = false) {
    this.onRefresh.emit();
  }

  onClickDelete(row, rowIndex) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
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

  updateFilter(event: any, column: any) {
    this.rows = [...this.rawData];
    const val = event.target.value.toLowerCase();
    var findIndex = this.listFilter.findIndex(x => x.prop === column.prop);
    if (findIndex < 0) this.listFilter.push({ prop: column.prop, value: val } as Filter);
    else this.listFilter[findIndex].value = val;

    var tempResult = this.rows;
    this.listFilter.forEach(element => {
     
      tempResult = tempResult.filter(x => {
        if(x[element.prop]) {
          return x[element.prop]?.toString()?.toLowerCase()?.trim()?.includes(element.value?.toLowerCase()?.trim())
        }
        else return true;
      })
    });
    this.rows = tempResult;
    this.table.offset = 0;
  }
}
