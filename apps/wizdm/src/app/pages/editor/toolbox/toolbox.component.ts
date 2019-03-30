import { Component, HostBinding, Input } from '@angular/core';
import { EditableSelection, wmTextStyle } from '@wizdm/editable';
import { $animations } from './toolbox.animations';

@Component({
  selector: 'wm-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  animations: $animations
})
export class ToolboxComponent {
  @HostBinding('@slide') slide = true;

  constructor(private sel: EditableSelection) {}

  readonly styles = ['bold', 'italic', 'underline', 'strikethrough'];
  readonly alignements = ['left', 'center', 'right', 'justify'];

  @Input() msgs: { [key: string]: string };
  @Input() tooltipDelay = 1000;

  public hasStyle(style: wmTextStyle): boolean {
    return this.sel.style.some(s => s === style);
  }

  public label(msg: string): string {
    return !!msg && msg.replace(/\t.*/, '');
  }

  doNothing() {}
}
