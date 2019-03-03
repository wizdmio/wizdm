import { Component, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatMenuTrigger } from '@angular/material';
import { EditableSelection } from '../selection/editable-selection.service';
import { wmTextStyle } from '../common/editable-types';

@Component({
  selector: 'wm-editable-menu',
  templateUrl: './editable-menu.component.html',
  styleUrls: ['./editable-menu.component.scss']
})
export class EditableMenu {

  @ViewChild(MatMenuTrigger) private trigger: MatMenuTrigger;

  public alignements = ['left', 'center', 'right', 'justify'];
  public formats = ['bold', 'italic', 'underline', 'strikethrough'];

  public labels = {
    content: {
      copy: "Copy",
      cut: "Cut",
      paste: "Paste"
    },
    size: {
      title: "Text size",
      heading1: "Heading 1",
      heading2: "Heading 2",
      heading3: "Heading 3",
      paragraph: "Paragraph"
    },
    insert: {
      title: "Insert",
      heading: "Heading",
      paragraph: 'Paragraph',
      bulletted_list: "Bulletted list",
      numbered_list: "Numbered_list",
      table: "Table",
      link: "Link...",
      unlink: "Remove link"

    },
    align: {
      title: "Alignement",
      left: 'Left',
      center: 'Center',
      right: 'Right',
      justify: 'Justify'
    },
    format: {
      title: "Format",
      bold: "Bold",
      italic: "Italic",
      underline: "Underline",
      strikethrough: "Strikethrough",
      clear: "Clear formatting",
      size: "Heading size"
    }
  };

  constructor(@Inject(DOCUMENT) private document: Document, private sel: EditableSelection) { }

  public get align() { return this.sel.align; }
  public set align(align) { this.sel.align = align; }

  public dummyLink() { this.sel.link('./'); }

  public unlink() { this.sel.unlink(); }

  public hasStyle(style: wmTextStyle): boolean {
    return this.sel.style.some( s => s === style);
  }

  public left = 0;
  public top = 0;

  // Opens the menu at the specified position
  public open({ x, y }: MouseEvent, data?: any) {
    // Makes sure the selection is up to date
    this.sel.query(this.document).trim().apply(this.document);
    // Pass along the context data to support lazily-rendered content
    if(!!data) { this.trigger.menuData = data; }
    // Adjust the menu anchor position
    this.left = x;
    this.top = y;
    // Opens the menu
    this.trigger.openMenu();
    // prevents default
    return false;
  }

  public content(cmd: 'copy'|'cut'|'paste') {
    //debugger;
    //this.sel.apply(this.document);
    //this.document.execCommand(cmd);
  }
}