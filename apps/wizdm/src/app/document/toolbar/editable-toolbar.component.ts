import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material';
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

  get style(): wmTextStyle[] { return this.sel.style; }

  public format(change: MatButtonToggleChange) {

    const oldFormat: wmTextStyle[] = this.style || [];
    const newFormat: wmTextStyle[] = change.value || [];

    const add = newFormat.filter( ff => oldFormat.every(oo => oo !== ff) );
    if(add.length > 0) {
      console.log('add: ' + add);
      this.sel.format(add);
    }

    const rem = oldFormat.filter( ff => newFormat.every(oo => oo !== ff) );
    if(rem.length > 0) {
      console.log('rem: ' + rem);
       this.sel.format(rem, true);
    }  
  }
/*
  
  public style: string[] = [];

  @Input('style') set currentFormat(format: string[]) {

    this.style = !!format ? format.filter( ff => this.styles.some(sm => ff === sm) ) : [];
    console.log(this.style);
  }
 */
}
