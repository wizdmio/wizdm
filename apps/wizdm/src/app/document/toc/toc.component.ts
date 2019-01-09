import { Component, OnInit, Input } from '@angular/core';
import { wmDocument, wmHeading, EditableContent } from '../editable/editable-content';

@Component({
  selector: 'wm-document-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class DocumentTocComponent extends EditableContent {

  //constructor() { super(); }

  public headings: wmHeading[];

  @Input() set source(source: wmDocument) {

    // Filters all heading nodes only
    this.headings = this.updateTree(source).filter( node => {
      return node.type === 'heading';
    }) as wmHeading[];
  }

  public encode(id: string) {
    return encodeURIComponent(id);
  }
}
