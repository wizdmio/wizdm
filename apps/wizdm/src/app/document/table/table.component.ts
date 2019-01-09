import { Component, Input } from '@angular/core';
import { wmTable, wmTableRow, EditableContent } from '../editable/editable-content';

@Component({
  selector: 'wm-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends EditableContent {

  //constructor() { super(); }

  public table: wmTable;
  public head: wmTableRow;
  public body: wmTableRow[];

  @Input('wm-table') set setTable(table: wmTable) {

    this.table = table;

    this.body = this.updateTree(table) as wmTableRow[];//(!!table && tablechildren) || [];
    
    this.head = this.body.shift();

  }

}