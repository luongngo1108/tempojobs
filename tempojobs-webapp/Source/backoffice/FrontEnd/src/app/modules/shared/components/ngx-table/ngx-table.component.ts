import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable/public-api';
import { Page } from '../../models/page';
import { PagedData } from '../../models/paged-data';

@Component({
  selector: 'app-ngx-table',
  templateUrl: './ngx-table.component.html',
  styleUrls: ['./ngx-table.component.scss']
})
export class NgxTableComponent implements OnInit {
  @Output() onRefresh = new EventEmitter<any>();
  @Input() columnsTable: [];
  isLoading = 0;
  rows = [];
  columns = [];
  ColumnMode: ColumnMode;
  page = new Page();
  constructor() {

  }

  ngOnInit(): void {
    this.columns = this.columns.concat(this.columnsTable);
  }

  setData(result: PagedData<any>) {
    if (result) {
      this.isLoading--;
      this.page = result.page;
      this.rows = result.data;
      //  if(!result.data) this.table.offset = Number.POSITIVE_INFINITY;
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
}
