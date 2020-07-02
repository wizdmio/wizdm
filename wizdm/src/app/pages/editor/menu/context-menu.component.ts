import { Component, Inject, ViewChild, Input, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemePalette } from '@angular/material/core'
import { MatMenuTrigger } from '@angular/material/menu';
import { wmTextStyle, EditableSelection } from '@wizdm/editable';

@Component({
  selector: 'wm-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
  @ViewChild(MatMenuTrigger) private trigger: MatMenuTrigger;

  readonly alignements = ['left', 'center', 'right', 'justify'];
  readonly formats = ['bold', 'italic', 'underline', 'strikethrough'];

  @Input() sel: EditableSelection;
  @Input() msgs: any = {};

  @HostBinding('attr.color')
  @Input() color: ThemePalette;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public get align() {
    return this.sel.align;
  }
  public set align(align) {
    this.sel.align = align;
  }

  public dummyLink() {
    this.sel.link('./');
  }

  public unlink() {
    this.sel.unlink();
  }

  public hasStyle(style: wmTextStyle): boolean {
    return this.sel.style.some(s => s === style);
  }

  public label(msg: string): string {
    return !!msg && msg.replace(/\t.*/, '');
  }

  public left = 0;
  public top = 0;

  // Opens the menu at the specified position
  public open({ x, y }: MouseEvent, data?: any) {
    // Pass along the context data to support lazily-rendered content
    if (!!data) {
      this.trigger.menuData = data;
    }
    // Adjust the menu anchor position
    this.left = x;
    this.top = y;
    // Opens the menu
    this.trigger.openMenu();
    // prevents default
    return false;
  }

  public edit(cmd: 'copy' | 'cut' | 'paste') {
    this.document.execCommand(cmd);
  }
}
