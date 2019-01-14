import { Component, OnInit, Input, HostBinding, HostListener, ElementRef } from '@angular/core';
import { EditableContent } from '../common/editable-content';

@Component({
  selector: '[wm-content]',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  node: EditableContent;

  constructor() {}
  
  @Input('wm-content') set source(node: EditableContent) {
    // Updates the node deferring children update to
    // take advantage from angular change detection
    this.node = node.update(true);
  }

  @HostBinding('id') get id() {
    return this.node.id;
  }
/*
  @HostListener('ValueChange', ['$event']) dummy(ev: KeyboardEvent) {

    const el = this.elref.nativeElement;
    console.log(el);
  }
*/
}