import { EditableDocumentData, EditableFigureData, EditableImageData } from '@wizdm/editable';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: '[wm-editable-text]',
  template: '{{ text }}'
})
export class PreviewTextComponent implements OnChanges {

  public text: string = "";

  /** Source editable document */
  @Input('wm-editable-text') document: EditableDocumentData;

  ngOnChanges() {

    this.text = "";

    
  }

}
