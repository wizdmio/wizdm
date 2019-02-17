import { Component, Input } from '@angular/core';
import { EditableContent } from '../common/editable-content';
import { wmDocument } from '../common/editable-types';

@Component({
  selector: 'wm-editable-toc',
  templateUrl: './editable-toc.component.html',
  styleUrls: ['./editable-toc.component.scss']
})
export class EditableToc {
  
  @Input() source: EditableContent<wmDocument>;

  public render(node: EditableContent): string {
    return !!node ? node.value.replace('\n', ' ') : '';
  }
}
