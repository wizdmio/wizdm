import { Component, HostBinding, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
import { EditableSelection, wmTextStyle } from '@wizdm/editable';
import { $animations } from './toolbox.animations';

@Component({
  selector: 'wm-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  host: { 'class': 'wm-theme-colors' },
  animations: $animations
})
export class ToolboxComponent {
  @HostBinding('@slide') slide = true;

  constructor() {}

  readonly styles = ['bold', 'italic', 'underline', 'strikethrough'];
  readonly alignements = ['left', 'center', 'right', 'justify'];

  @Input() sel: EditableSelection;
  @Input() msgs: any = {};
  @Input() tooltipDelay = 1000;

  @HostBinding('attr.color')
  @Input() color: ThemePalette;

  public hasStyle(style: wmTextStyle): boolean {
    return this.sel.style.some(s => s === style);
  }

  public label(msg: string): string {
    return !!msg && msg.replace(/\t.*/, '');
  }

  doNothing() {}
}
