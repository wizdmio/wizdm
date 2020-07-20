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
  private _items: TocItem[];
  private _index: TocItem[];

  // Injects the parent TocComponent, if any, to compute the indentation level accordingly
  constructor(@Optional() @SkipSelf() private parent: TocComponent) {}

  /** Returns the indentation level in pixels */
  get indent(): number { return !!this.parent ? this.parent.indent + 24 : 0; }

  /** The currently selected item */
  get selected(): TocItem { return this._selected; }

  /** The toc items at this level */
  get items(): TocItem[] { return this._items; }

  /** The linear toc index  */
  get index(): TocItem[] { return this._index || []; }

  /** Moves the selection to the previous or the next page according to dir*/
  public go(dir: 'prev'|'next') {

    this.selected = dir === 'prev' ? this.previousPage() : this.nextPage(); 
    /** Emits the navigation link, if any */
    this.navigate.emit(this.selected.link);
  }

  /** The toc items to render */
  @Input('wm-toc') set items(items: TocItem[]) {
    // Computes the linear index while storing the input
    this._index = this.buildIndex(this._items = items);
  }

  /** Active link highlighting color */
  @Input() color: ThemePalette = 'accent';

  /** Selects the toc item by the page */
  @Input() set path(path: string) {
    // Seeks for the page from the index
    this.selected = this.findPage(path);
  }

  /** Selects the given item */
  @Input() set selected(item: TocItem) {

    // Skips useless updates
    if(this._selected === item) { return; }

    // Updates the selection
    this.selectedChange.emit(this._selected = item);

    // Ensures the panels open whenever a children is currently selected
    this.items?.forEach( item => this.hasSelection(item) && this.open(item) );
  }

  /** Emits the currently selected item */
  @Output() selectedChange = new EventEmitter<TocItem>();

  /** Emits the target link when clicking on a navigation item */
  @Output() navigate = new EventEmitter<string>();
  
  /** Builds a linear index from the toc tree */
  private buildIndex(items: TocItem[]): TocItem[] {
    // Skips to the parent index
    if(!!this.parent) { return this.parent.index; }
    // Computes the index otherwise
    return items && items.reduce( (index, item) => {
      // Concatenates the index from the next level
      if('items' in item) {

        return index.concat(this.buildIndex(item.items)); 
      }
      // Pusches the item
      return index.push(item), index;
    }, []);
  }

  /** Returns the requested page */
  public findPage(path: string): TocItem {
   // Seeks for the page within the linear index
   return this.index.find( item => item.link && item.link.endsWith(path) );
  }

  /** Returns the next page from the given position */
  public nextPage(from: TocItem = this.selected): TocItem {
    // Seeks for the next page from the linear index
    return this.index[ this.index.findIndex(item => item === from) + 1] || this.index[0];
  }

  /** Returns the preceeding page from the given position */
  public previousPage(from: TocItem = this.selected): TocItem {
    // Seeks for the previous page from the linear index
    return this.index[ this.index.findIndex(item => item === from) - 1] || this.index[this.index.length - 1];
  }

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