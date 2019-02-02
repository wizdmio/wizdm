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

  public aligns = ['left', 'center', 'right', 'justify'];

  constructor(private sel: EditableSelection) { }

  public get align() {
    return '';
  }

  public set align(align) {
    
  }

  //--

  public left = 0;
  public top = 0;

  // Opens the menu at the specified position
  public open({ x, y }: MouseEvent, data?: any) {

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