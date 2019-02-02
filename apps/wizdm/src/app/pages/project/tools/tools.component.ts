import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material';
import { $animations } from './tools.animations';

@Component({
  selector: 'wm-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
  animations: $animations
})
export class ToolsComponent {

  @HostBinding('@slide') slide = true;

  public formats = ['bold', 'italic', 'underline', 'strikethrough'];
  public format: string[] = [];

  @Input('format') set currentFormat(format: string[]) {

    this.format = !!format ? format.filter( ff => this.formats.some(sm => ff === sm) ) : [];
    console.log(this.format);
  }
  
  @Output() formatChange = new EventEmitter<string[]>();

  applyFormat(format: MatButtonToggleChange) {

    console.log(format.value);

    const oldFormat = this.format || [];
    const newFormat = format.value || [];

    const add = newFormat.filter( ff => oldFormat.every(oo => oo !== ff) );
    const rem = oldFormat.filter( ff => newFormat.every(oo => oo !== ff) );

    console.log('add: ' + add);
    console.log('rem: ' + rem);

    //this.formatChange.emit(format.value || []);
  
  }
}