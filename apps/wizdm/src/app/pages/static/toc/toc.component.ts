import { Component, Input, Output, Optional, SkipSelf, EventEmitter } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { $animations } from './toc.animations';

export interface TocItem {
  label: string;
  link?: string;
  items?: TocItem[];
  opened?: boolean;
}

@Component({
  selector: '[wm-toc]',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss'],
  animations: $animations
})
export class TocComponent {

  private _selected: TocItem;

  /** Returns the indentation level in pixels */
  get indent(): number { return !!this.parent ? this.parent.indent + 24 : 0; }

  /** The currently selected item */
  get selected(): TocItem { return this._selected; }

  // Injects the parent TocComponent, if any, to compute the indentation level accordingly
  constructor(@Optional() @SkipSelf() private parent: TocComponent) {}

  /** Active link highlighting color */
  @Input() color: ThemePalette = 'accent';

  /** The toc items to render */
  @Input('wm-toc') items: TocItem[];

  /** Selects the toc item by the page */
  @Input() set page(page: string) {

    // Searches recursively throughout the items 
    const find = (page, items: TocItem[]) => items && items.reduce( (found, item) => {
      // Returns the found item
      if(!!found) { return found; }
      // Checks the link for ending with the given page
      if(item.link && item.link.endsWith(page)) { return item; }
      // Recurs down the children
      return find(page, item.items); 

    }, undefined);
      
    // Starts searching
    this.selected = find(page, this.items);
  }

  /** Emits the target link when clicking on a navigation item */
  @Output() navigate = new EventEmitter<string>();
  
  /** Selects the given item */
  @Input() set selected(item: TocItem) {

    // Skips useless updates
    if(this._selected === item) { return; }

    // Updates the selection
    this.selectedChange.emit(this._selected = item);

    // Ensures the panels open whenever a children is currently selected
    this.items.forEach( item => this.hasSelection(item) && this.open(item) );
  }

  /** Emits the currently selected item */
  @Output() selectedChange = new EventEmitter<TocItem>();

  /** Updates the selection upon click */
  public onItemClick(item: TocItem) {

    // Toggles the panel opened/closed
    this.open(item, !this.isOpened(item) );

    /** Emits the navigation link, if any */
    if('link' in item) { this.navigate.emit(item.link); }
  }

  /** Returns true when the given item has sub items, false otherwise */
  public hasItems(item: TocItem): boolean {
    return 'items' in item;
  }

  /** Returns the array of sub items */
  public subItems(item: TocItem): TocItem[] {
    return ( ('items' in item) && item.items ) || [];
  }

  /** Opens/Closes the sub items panel, if any */
  public open(item: TocItem, open: boolean = true) {

    if(this.hasItems(item)) { 
      item.opened = open;  
    }
  }

  /** Returns true whenever the sub items panel is opened */
  public isOpened(item: TocItem) {
    return this.hasItems(item) && !!item.opened;
  }

  /** Returns true whenever the item or one of the sub itms is actually selected */
  public hasSelection(item: TocItem): boolean {

    return (item === this._selected) || this.subItems(item).some( sub => this.hasSelection(sub) );
  }
}