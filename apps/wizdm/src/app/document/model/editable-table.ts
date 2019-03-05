import { wmTable, wmRow, wmCell } from './editable-types';
import { EditableContent } from './editable-content';

export class EditableTable extends EditableContent<wmTable> {

  get rows(): number { return this.count; }
  get cols(): number { return this.firstChild().count; }

  public row(index: number): EditableRow {
    return this.childAt(index) as EditableRow;
  }

  private seekRow(ref: EditableContent): EditableRow {
    const row = ref.climb('row') as EditableRow;
    return !!row && this.childOfMine(row) ? row : null;
  }

  private emptyRow(cols: number): EditableRow {
    return this.factory.create({ type: 'row'}).emptyRow(cols);
  }

  public rowAbove(ref: EditableContent): EditableRow {

    const above = this.seekRow(ref);
    return !!above ? this.insertBefore(above, this.emptyRow(above.count)) as EditableRow : null;
  }

  public rowBelow(ref: EditableContent): EditableRow {

    const below = this.seekRow(ref);
    return !!below ? this.insertAfter(below, this.emptyRow(below.count)) as EditableRow : null;
  }
}

export class EditableRow extends EditableContent<wmRow> {

  public col(index: number): EditableCell {
    return this.childAt(index) as EditableCell;
  }

  private seekCell(ref: EditableContent): EditableCell {
    const cell = ref.climb('cell') as EditableCell;
    return !!cell && this.childOfMine(cell) ? cell : null;
  }

  public emptyRow(cols: number): EditableRow {

    this.children = Array(cols).map( () => {
      return this.factory.create({ type: 'cell' }).emptyCell();
    });
    return this;
  }
}

export class EditableCell extends EditableContent<wmCell> {

  public emptyCell(): EditableCell {
    this.children = [ this.factory.create({ type: 'text', value: '' })];
    return this;
  }
}