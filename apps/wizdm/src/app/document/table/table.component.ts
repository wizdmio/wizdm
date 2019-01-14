import { Component, Input } from '@angular/core';
import { wmTable, wmTableRow, EditableContent } from '../common/editable-content';

@Component({
  selector: 'wm-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  constructor() { }

  public table: EditableContent<wmTable>;
  public head: EditableContent<wmTableRow>[];
  public foot: EditableContent<wmTableRow>[];
  public body: EditableContent<wmTableRow>[];
/*
  private updateRow(row: EditableContent<wmTableRow>, update: boolean): boolean {
    if(update) { row.update();}
    return update;
  }
*/
  @Input('wm-table') set source(table: EditableContent<wmTable>) {
    // Updates the node deferring descendants
    this.table = table.update(true);
    this.updateRows(this.table);
  }

  private updateRows(table: EditableContent<wmTable>) {

    this.head = [];
    this.foot = [];
    this.body = [];

    // Splits and updates rows
    const rows = table.content as EditableContent<wmTableRow>[]
    rows.forEach( row => {
      if(!!row.data.head) { this.head.push( row.update(true) ); } 
      else if(!!row.data.foot) { this.foot.push( row.update(true) ); } 
      else { this.body.push( row.update(true) ); }
    });

    //this.head = rows.filter( row => this.updateRow(row, !!row.data.head) );
    //this.foot = rows.filter( row => this.updateRow(row, !!row.data.foot) );
    //this.body = rows.filter( row => this.updateRow(row, !row.data.head && !row.data.foot) );
  }
}