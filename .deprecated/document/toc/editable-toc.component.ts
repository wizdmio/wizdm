import { Component, Input } from '@angular/core';
import { EditableDoc } from '../model';

@Component({
  selector: 'wm-editable-toc',
  templateUrl: './editable-toc.component.html',
  styleUrls: ['./editable-toc.component.scss']
})
export class EditableToc {
  
  @Input() source: EditableDoc;

  public render(node: any): string {
    return !!node ? node.value.replace('\n', ' ') : '';
  }
}
