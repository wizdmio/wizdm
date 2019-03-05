import { Component, Input, HostBinding } from '@angular/core';
import { EditableTable } from '../model';

@Component({
  selector: 'table[wm-table]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  constructor() { }

  @Input('wm-table') table: EditableTable;

  @HostBinding('id') get id() {
    return !!this.table && this.table.id;
  }
/*
  public table: EditableContent<wmTable>;
  public head: EditableContent<wmRow>[];
  public foot: EditableContent<wmRow>[];
  public body: EditableContent<wmRow>[];

  @Input('wm-table') set source(table: EditableContent<wmTable>) {
    // Split the table rows
    this.table = this.splitRows(table);
  }

  private splitRows(table: EditableContent<wmTable>) {

    this.head = [];
    this.foot = [];
    this.body = [];

    // Splits the table rows
    const rows = table.content as EditableContent<wmRow>[]
    rows.forEach( row => {
      if(!!row.data.head) { this.head.push( row ); } 
      else if(!!row.data.foot) { this.foot.push( row ); } 
      else { this.body.push( row ); }
    });
    //this.head = rows.filter( row => this.updateRow(row, !!row.data.head) );
    //this.foot = rows.filter( row => this.updateRow(row, !!row.data.foot) );
    //this.body = rows.filter( row => this.updateRow(row, !row.data.head && !row.data.foot) );
    return table;
  }*/
}