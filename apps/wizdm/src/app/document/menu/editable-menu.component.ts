import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { EditableSelection } from '../selection/editable-selection.service';

@Component({
  selector: 'wm-editable-menu',
  templateUrl: './editable-menu.component.html',
  styleUrls: ['./editable-menu.component.scss']
})
export class EditableMenu {

  @ViewChild(MatMenuTrigger) private trigger: MatMenuTrigger;

  public headings = ['Heading 1', 'Heading 2', 'Heading 3', 'Paragraph'];
  public alignements = ['left', 'center', 'right', 'justify'];
  public formats = ['bold', 'italic', 'underline', 'strikethrough'];

  public labels = {
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

  constructor(private sel: EditableSelection) { }

  //--

  public left = 0;
  public top = 0;

  // Opens the menu at the specified position
  public open({ x, y }: MouseEvent, data?: any) {
    // Makes sure the selection is up to date
    this.sel.query().trim().apply();
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
}