import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { EditableSelection } from '../selection/editable-selection.service';
import { wmTextStyle } from '../common/editable-types';
import { $animations } from './editable-toolbar.animations';

@Component({
  selector: 'wm-editable-toolbar',
  templateUrl: './editable-toolbar.component.html',
  styleUrls: ['./editable-toolbar.component.scss'],
  animations: $animations
})
export class EditableToolbar{

  @HostBinding('@slide') slide = true;

  constructor(private sel: EditableSelection) { }

  public styles = ['bold', 'italic', 'underline', 'strikethrough'];
  public alignements = ['left', 'center', 'right', 'justify'];

  public hasStyle(style: wmTextStyle): boolean {
    return this.sel.style.some( s => s === style);
  }

  doNothing() {}
}
