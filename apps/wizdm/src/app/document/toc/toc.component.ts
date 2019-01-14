import { Component, Input } from '@angular/core';
import { EditableContent, wmDocument, wmHeading } from '../common/editable-content';

@Component({
  selector: 'wm-document-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class DocumentTocComponent {
  
  private root: EditableContent<wmDocument>;
  public headings: EditableContent<wmHeading>[];

  @Input() set source(source: wmDocument) {
    // Creates the root node and updates its children
    // deferring descendants nodes to their components
    this.root = new EditableContent(source).update(true);
    this.headings = <EditableContent<wmHeading>[]>this
      .root.content.filter( node => {
        if(node.type === 'heading') {
          node.update(true);
          return true;
        }
        return false;
      });
  }

  public encode(id: string) {
    return encodeURIComponent(id);
  }
}
