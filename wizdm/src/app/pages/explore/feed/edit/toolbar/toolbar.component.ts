import { Component, HostBinding, Input } from '@angular/core';
import { EditableSelection } from '@wizdm/editable/document';
import { ThemePalette } from '@angular/material/core';
import { EditableTextStyle } from '@wizdm/editable';
import { $animations } from './toolbar.animations';

@Component({
  selector: 'wm-post-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: $animations
})
export class ToolbarComponent {

  public more: boolean = false;

  @Input() sel: EditableSelection;
  @Input() msgs: any = {};
  @Input() tooltipDelay = 1000;

  @HostBinding('attr.color')
  @Input() color: ThemePalette;

  public hasStyle(style: EditableTextStyle): boolean {
    return this.sel.style.some(s => s === style);
  }

  public label(msg: string): string {
    return !!msg && msg.replace(/\t.*/, '');
  }

  doNothing() {}
}
