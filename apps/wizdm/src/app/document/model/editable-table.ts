import { wmTable, wmRow, wmCell } from './editable-types';
import { EditableContent } from './editable-content';

export class EditableTable extends EditableContent<wmTable> {

  get rows(): number { return this.count; }
  get cols(): number { return this.firstChild().count; }

  public row(index: number): EditableRow {
    return this.childAt(index) as EditableRow;
  }

  public initTable(rows: number, cols: number): EditableTable {

    for(let r = 0; r < rows; r++) { 
      this.addRow().initRow(cols); 
    }
    return this;
  }

  private addRow(): EditableRow {
    return this.appendChild(this.create.row) as EditableRow;
  }

  public insertRow(ref: EditableRow, where: 'above'|'below'): EditableRow {

    switch(this.childOfMine(ref) && where) {

      case 'above':
      return this.insertBefore(ref, ref.clone().set('') ) as EditableRow;

      case 'below':
      return this.insertAfter(ref, ref.clone().set('') ) as EditableRow;
    }
    return null;
  }

  public removeRow(row: EditableRow) { 
    return this.childOfMine(row) && row.remove(), row;
  }

  public insertColumn(ref: EditableCell, where: 'left'|'right'): EditableCell {

    const row = this.content.find( row => row.childOfMine(ref) ) as EditableCell;
    if(!row) { return null; }

    const index = row.findIndex(ref);
    index >= 0 && this.content.forEach( (row: EditableRow) => {
      row.insertCell( row.col(index), where );
    });
    
    return ref;
  }

  public removeColumn(ref: EditableCell) {

    const row = this.content.find( row => row.childOfMine(ref) ) as EditableCell;
    if(!row) { return null; }

    const index = row.findIndex(ref);
    index >= 0 && this.content.forEach( (row: EditableRow) => {
      row.col(index).remove();
    });
    
    return ref; 
  }
}

export class EditableRow extends EditableContent<wmRow> {

  public col(index: number): EditableCell {
    return this.childAt(index) as EditableCell;
  }

  public initRow(cells: number): EditableRow {

    for(let c = 0; c < cells; c++) { 
      this.addCell().initCell(); 
    }
    return this;
  }

  private addCell(): EditableCell {
    return this.appendChild(this.create.cell) as EditableCell;
  }

  public insertCell(ref: EditableCell, where: 'left'|'right'): EditableCell {

    switch(this.childOfMine(ref) &&  where) {

      case 'left':
      this.insertBefore(ref, ref.clone().set('') ) as EditableCell;
      break;

      case 'right':
      this.insertAfter(ref, ref.clone().set('') ) as EditableCell;
      break;
    }
    return ref;
  }
}

export class EditableCell extends EditableContent<wmCell> {

  // Overrides the default setter forcing a single node value 
  public set(text: string): this {
    // Wipes text nodes exceeding the fist
    if(this.count > 1) { this.splice(1, -1); }
    // Updates the first node value
    if(this.count > 0) { this.firstChild().value = text };
    // Return this for chaining
    return this; 
  }

  public initCell(): EditableCell {
    return this.appendChild(this.create.text).set('') as EditableCell;
  }
}