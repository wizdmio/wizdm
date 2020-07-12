import { Component, Input, Output, EventEmitter, HostBinding, HostListener, Inject } from '@angular/core';
import { ElementRef, ViewEncapsulation, NgZone } from '@angular/core';
import { Subject, Subscription, animationFrameScheduler } from 'rxjs';
import { filter, map, timeInterval, take } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { EmojiText, emSegment } from '@wizdm/emoji/text';
import { EmojiUtils } from '@wizdm/emoji';
import { DOCUMENT } from '@angular/common';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'wm-emoji-input',
  templateUrl: './emoji-input.component.html',
  styleUrls: ['./emoji-input.component.scss'],
  inputs: ['mode'],
  encapsulation: ViewEncapsulation.None,
  host: { "class": "wm-emoji-input" }
})
export class EmojiInput extends EmojiText implements OnDestroy {

  // Internal value
  private _value: string;
  // Current selection
  private start: number;
  private end: number;

  constructor(@Inject(DOCUMENT) private document: any, private elref: ElementRef<HTMLElement>, private zone: NgZone, utils: EmojiUtils) {
    super(utils);
  }

  /** True whenever the curernt selection is collapsed in a cursor */
  public get collapsed(): boolean { return this.start === this.end; }

  /** Input's HTMLElement */
  public get element(): HTMLElement { return this.elref.nativeElement; }

  /** The Document's Selection object */
  private get selection(): Selection { return this.document.getSelection(); }

  /** The Window object */
  private get window(): Window { return this.document.defaultView; }

  /** True whenever the platform is Mac, iPhone or iPad */
  private get mac(): boolean { return /Mac|^iP/.test(this.window.navigator.platform); }

  /** True whenever this input has focus */
  public get focused(): boolean { return this.document.activeElement === this.element; }

  /** Sets the focus on the input's element */
  public focus() { this.element.focus(); }

  /** Removes focus from the input's element; keystrokes will subsequently go nowhere. */
  public blur() { this.element.blur(); }

  // Applies the contentediable attribute unless the input is disabled
  @HostBinding('attr.contenteditable') get editable() { 
    return this.disabled ? undefined : ''; 
  }

  // Marks the input as empty supporting displaying/hiding of the placeholder text
  @HostBinding('class.empty') get showPlaceholder(): boolean {
    return !this.value;
  }

  /** The placeholder text */
  @HostBinding('attr.placeholder')
  @Input() placeholder: string;

  /** The input value */
  get value(): string { return this._value || ''; }
  @Input() set value(value: string) {
    // Avoids unecessary changes
    if(value === this.value) { return; }
    // Restarts the undo history whenevevr the input value changes.
    this.enableHistory(this.historyTime, this.historyLimit); 
    // Compiles the new text and emits the update
    this.compile( this._value = value );
  }

  // Clears the history while leaving 
  ngOnDestroy() { this.clearHistory(); }

   /** Emits the new text on changes */
  @Output() valueChange = new EventEmitter<string>();
  
  /** Disables the input */
  @Input('disabled') set disableInput(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false; 

  /** Marks the input as required */
  @Input('required') set requireInput(value: boolean) { this.required = coerceBooleanProperty(value); }
  public required = false; 

  /** Selects the newline mode. 
   * - None: enter does nothig. 
   * - Always: enter always inserts a new line. 
   * - Shift: enter inserts newline in conjunction with the shift key only */
  @Input() newline: 'none'|'always'|'shift' = 'always';

  /** Undo history bouncing time */
  @Input() historyTime: number = 1000;

  /** Undo history limits */
  @Input() historyLimit: number = 128;

  // Handles beforeinput event
  @HostListener('beforeinput', ['$event']) beforeInput(ev: InputEvent) { 
    // Divert the insertion content to the internal implementation
    if(ev.data) { this.insert(ev.data); }
    // Prevents the default behavior
    return false;
  }

  // Handles keydown event
  @HostListener('keydown', ['$event']) keyDown(ev: KeyboardEvent) {

    switch(ev.key) {

      // Reverts navigation to default
      case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight': case 'ArrowUp': 
      case 'Tab': case 'Home': case 'End': case 'PageUp': case 'PageDown':
      return true;
     
      // Deletes the current selection
      case 'Delete':
      this.del(); break;
      
      // Deletes back
      case 'Backspace':
      this.backspace(); break;

      // Insert a newline according to the newline input mode
      case 'Enter': if(this.newline === 'always' || (this.newline === 'shift' && ev.shiftKey)) { 
        this.insert('\n');
      }
      break;

      // Editing
      default: if(ev.key.length === 1 || this.utils.isEmoji(ev.key) ) {

        // Prevents keyboard repeating giving a chance to Mac's press&hold to work
        if(ev.repeat && this.mac) { return false; }

        // Intercepts accelerators
        if(ev.metaKey && this.mac || ev.ctrlKey) {
          return this.keyAccellerators(ev);
        }

        // Inserts new content
        this.insert(ev.key);
      }
    }

    // Prevents default
    return false;
  }

  /** Handles keayboard accellerators */
  private keyAccellerators(ev: KeyboardEvent) {

    switch(ev.key) {

      // Ctrl/Cmd Z -> Undo
      case 'z': case 'Z': 
      // Reverts to Redo whenever shift is pressed on a Mac
      if(ev.shiftKey && this.mac) { return this.redo(), false; }
      // Performs thr Undo
      return this.undo(), false;

      // Ctrl/Cmd Y -> Redo 
      case 'y': case 'Y': 
      // Performs the Redo unless its a Mac
      if(!this.mac) { return this.redo(), false; }
    }
    // Reverts to default
    return true;
  }

  // Handles cut event
  @HostListener('cut', ['$event']) editCut(ev: ClipboardEvent) {
    // Reverts the cut request to copy the content first...
    this.editCopy(ev);
    // Deletes the selection
    this.del();
    // Always prevent default
    return false;
  } 
  
  // Handles copy event
  @HostListener('copy', ['$event']) editCopy(ev: ClipboardEvent) {
    // Gets the clipboard object
    const cp = ev.clipboardData || (this.window as any).clipboardData;
    if(!cp) { return true; }
    // Copies the selected text
    try { cp.setData('text', this.query().value.slice(this.start, this.end) ); }
    catch(e) { /*console.error(e);*/ }
    // Prevents default
    return false;
  }

  // Handles paste event
  @HostListener('paste', ['$event']) editPaste(ev: ClipboardEvent) {
    // Gets the clipboard object
    const cp = (ev.clipboardData || (window as any).clipboardData);
    if(!cp) { return false; }
    // Pastes the data from the clipboard
    try { this.insert( cp.getData('text') ); }
    catch(e) { /*console.error(e);*/ }
    // Prevents default
    return false;
  }

  /** Compiles the input text into segment accounting for multiple lines */
  protected compile(source: string): number {
    // Appends an extra '\n' forcing the browser displaying a new line normally omitted when at the end
    return super.compile(source + (source && source.endsWith('\n') ? '\n' : ''));
  }

  /** Wait for the current queue of microtaks to be emptied. The async funtion will than be called after the rendering completed */
  private whenDone(async: () => void) { 
    this.zone.onStable.pipe( take(1) ).subscribe( () => async() ); 
  }

  /** Selects the text between start and end when specified. 
   * Sets the cursor position otherwise */
  public select(start: number, end?: number): this {

    this.start = Math.max(start, 0);
    this.end = Math.min(end || this.start, this.value.length);
    return this.sort().apply();
  }

  /** Insert a new text at the current cursor position */
  public insert(key: string): this {
    // Skips empty insertions when unfruitful
    if(!key && this.collapsed) { return this; }
    // Stores the current values in history
    return this.query().store().ins(key);
  }

  /** Deletes the current selection (Del-like) */
  private del(): this {
    // Stores the current values in history
    this.query().store();
    // Whenevevr collapsed...
    if(this.collapsed){
      // Skips when at the end of the text
      if(this.end === this.value.length) { return; }
      // Moves the end side of the selection ahead otherwise
      this.end = this.next(this.end);
    } 
    // Removes the selected text
    return this.ins('');
  }

  /** Deletes the previous character (Backspace-like) */
  public backspace(): this {
    // Stores the current values in history
    this.query().store();
    // Whenevevr collapsed...
    if(this.collapsed) {
      // Skips when at the start of the text
      if(this.start <= 0) { return; } 
      // Moves the start side of the selection back otherwise
      this.start = this.prev(this.start);
    }
    // Deletes the selected block 
    return this.ins('');
  }

  /** Internal insertion/deletion helper */
  private ins(key: string): this {
    // Computes the new text value
    const text = this.value.slice(0, this.start) + key + this.value.slice(this.end);
    // Computes the new cursor location
    const caret = this.start + key.length;
    // Updates the content
    return this.update(text, caret, caret);
  }

  /** Updates the value of the text and selection  */
  private update(value: string, start: number, end: number): this {
    // Restores the selection
    this.start = start; this.end = end;
    // Restores the content
    this.compile(this._value = value);
    // Applies the selection back when rendering is done
    this.focused && this.whenDone( () => this.apply() );
    // Emits the ne value
    this.valueChange.emit(this.value);
    // Returns this for chaining purposes
    return this;
  }

  /** Moves the given selection index ahead by one character */
  private next(pos: number): number { 
    // Moving ahead requires to jump one or more character depending on the letngh of the emoji, if any.
    // So, search for a match with an emoij, first
    const match = this.utils.matchEmojiCodes(this.value.slice(pos));
    // Updates the position accordingly
    return pos + ((match && match.index === 0) ? match[0].length : 1); 
  }

  /** Moves the given selection index back by one character */
  private prev(pos: number): number {
    // Moving the cursor backwards is performed by moving forward from index 0 up until one step before the starting position.
    // This accounts for the variable length of emoji(s) that can't be successfully matched backwards
    let offset = 0; let next = 0;
    while((next = this.next(next)) < pos) {
      offset = next;
    }
    return offset;
  }

  /** Sorts the selection edges */ 
  private sort(): this {
    
    if(this.start <= this.end) { return this; }

    const tmp = this.start; 
    this.start = this.end; 
    this.end = tmp;

    return this;
  }

  /** Queries the current selection */
  private query(): this {

    try {
       // Gets the current document selection first
      const sel = this.selection;
      // Computes the start offset from the anchor node
      this.start = this.offset(sel.anchorNode, sel.anchorOffset);
      // Computes the end offset from the focus node
      this.end = sel.isCollapsed ? this.start : this.offset(sel.focusNode, sel.focusOffset);
    }
    catch(e) { this.start = this.end = 0; /*console.error(e);*/ }
    // Sorts the edges and returns this for chaining purposes
    return this.sort();
  }

  /** Applies the current selection back to the dom */
  private apply(): this {

    try {
      // Gets the current document selection first
      const sel = this.selection;
      // Computes the dom node/offset selection pair for the start offset only
      const [node, offset] = this.range(this.start);
      // Applies the selection as a collapsed cursor
      sel.collapse(node, offset);
      // Check for the seleciton to be applied correctly...
      if(sel.anchorNode !== node || sel.anchorOffset !== offset) { 
        // ...otherwise schedule a second attempt during the next animation frame update to cope with
        // browsers (Safari) requiring the dome to be actually rendered for the selection to work
        animationFrameScheduler.schedule( () => this.apply() ); 
      }
    }
    catch(e) { /*console.error(e);*/ }
    // Returns this for chaining purposes
    return this;
  }

  /** Forces the cursor position to fall right before or after the emoji image the user clicked onto */
  public cursorAt(segment: emSegment, at: 'left'|'right') {

    // Updates the current cursor position based on the emoji image the user clicked onto
    this.start = this.end = this.abs(segment, at === 'right' ? segment.content.length : 0);
    this.selection.collapse(...this.range(this.start));
  }

  /** Selection helper function: Computes the absolute offset from the given segment and relative offset */
  private abs(segment: emSegment, offset: number = 0): number {
    // Skips invalid segments
    if(!segment) { return 0; }
    // Loops on all the segments
    for(let seg of this.segments) {
      // Stops when the requested segment matches
      if(segment === seg) { break; }
      // Accumulates the offset by the segment's content length
      offset += (seg.content || '').length;
    }
    // Returns the accumulated offset
    return offset;
  }

  /** Computes the absolute text offset from the Node/offset dom selection pair */  
  private offset(node: Node, offset: number): number {
    // Short-circuits for invalid nodes
    if(!node) { return this.value?.length || 0; }

    // Case #1: The given node is a text node, meaning the dom selection is expressed as the text-node and the relative offset whithin such text. We keep the pair unchanged and move forward.
    if(node.nodeType !== Node.TEXT_NODE) {
      // Cases #2: The given node isn't a text node (likely is the host container element), meaning the dom selection is expressed as the containing node while the offseet is the index of the selected element.

      // Ensures the given node has chilldren
      const count = node.childNodes.length;
      if(!count) { return 0; }
      // Gets the selected child node (saturating to the last child) and resets the offset for the furtner calculations
      node = node.childNodes.item(Math.min(offset, count-1));
      offset = 0;
    }

    // Loops on the nodes composing the rendered output
    let child = this.element.firstChild; let text = ''; 
    while(child) {
      // When we match the requested node, we are done. The offset is calculated as the accumulated text length.
      if(child == node) { return text.length + offset; } 
      // Appends the text content depending on the node type
      text += this.nodeText(child);
      // Skips to the next node
      child = child.nextSibling;
    }

    return this.value?.length || 0;
  }

  /** Computes a Node/offset dom selection pair from an absolute offset */
  private range(offset: number): [ Node, number ] {
    // Starts with the first child node of the input's element
    let node = this.element.firstChild;
    // Seeks for the relevan node matching the index
    let count = 0; 
    while(node) {
      // Gets the node text content, if any 
      const text = this.nodeText(node);
      // When the offset fits within the node we are done
      if(offset <= text.length) { 

         // Case #1: When the matching node is a text node...
        if(node.nodeType === Node.TEXT_NODE) {
          // Returns the text node kind of selection with the content based offset
          return [ node, offset ];
        }

        // Case #2: We must be at the IMG, so, return the element offset instead
        return [ this.element, count + 1 ];
      }
      // Decreses the absolute offset
      offset -= text.length;
      // Counts the number of child nodes otherwise (including comments)
      count++;
      // Goes to the next sibling
      node = node.nextSibling;
    }

    // Case #3: No matches found, return a zero based offset
    return [ this.element, 0 ]
  }

  /** Returns the text associated with the given node */
  private nodeText(node: Node): string {
          
    switch(node.nodeType) {

      // The value of the tetxt node
      case Node.TEXT_NODE:
      return node.nodeValue;
      break;

      // The alt of an image element
      case Node.ELEMENT_NODE:
      switch((node as Element).tagName) {

        case 'IMG':
        return (node as HTMLImageElement).alt || '';
        break;
      }
    }
    return '';
  }

  /********** HISTORY UNDO/REDO ***********/

  private store$ = new Subject<{ value: string, selection: [number, number] }>();
  private history: { value: string, selection: [number, number] }[];
  private timeIndex: number;
  private sub$: Subscription;

  /** Clears the history buffer */
  private clearHistory(): this {
    // Unsubscribe the previous subscription, if any
    if(!!this.sub$) { this.sub$.unsubscribe(); }
    // Initializes the history buffer
    this.timeIndex = 0;
    this.history = [];
    return this;
  }

  /** Initilizes the history buffer */
  private enableHistory(debounce: number = 1000, limit: number = 128): this {
    // Clears the history buffer
    this.clearHistory();
    // Builts up the stream optimizing the amout of snapshot saved in the history 
    this.sub$ = this.store$.pipe( 
      // Append a time interval between storing emissions
      timeInterval(), 
      // Filters requests coming too fast (within 'debounce time')
      filter( payload => this.history.length === 0 || payload.interval > debounce), 
      // Gets a snapshot of the value with updated selection
      map( payload => payload.value ),
    // Subscribes the history save handler
    ).subscribe( snapshot => {
      // Wipes the further future undoed snapshots since they are now 
      if(this.timeIndex > 0) {
        // Save the last snapshot wiping the further future undoed once
        this.history.splice(0, this.timeIndex + 1, snapshot);
        // Resets the time index
        this.timeIndex = 0;
      }
      // Saves the last snapshot in the history
      else { this.history.unshift(snapshot); }
      // Removes the oldest snapshot when exceeeding the history limit
      if(this.history.length > limit) { this.history.pop(); }
    });

    return this;
  }

  /** Stores a snapshot in the undo/redo history buffer 
   * @param force (option) when true forces the storage unconditionally.
   * Storage will be performed conditionally to the time elapsed since 
   * the last modification otherwise.
  */
  private store(force?: boolean): this { 

    if(!!force) {
      // Pushes a snapshot into the history buffer unconditionally
      this.history.unshift({ value: this.value, selection: [this.start, this.end] }); 
      return this; 
    }
    // Pushes the document for conditional history save
    this.store$.next({ value: this.value, selection: [this.start, this.end] });
    return this; 
  }
 
  /** Returns true whenever the last modifications can be undone */
  private get undoable(): boolean { return this.history.length > 0 && this.timeIndex < this.history.length - (!!this.timeIndex ? 1 : 0); }

  /** Undoes the latest changes. It requires enableHistory() to be called */
  private undo(): this {
    // Stops undoing when history is finished
    if(!this.undoable) { return this; }
    // Saves the present moment to be restored eventually
    if(this.timeIndex === 0) { this.store(true); }
    // Gets the latest snapshot from the history
    const snapshot = this.history[++this.timeIndex];
    // Reloads the snapshot's content restoring the selection too
    return this.update(snapshot.value, ...snapshot.selection);
  }

  /** Returns true whenever the last undone modifications can be redone */
  private get redoable(): boolean { return this.history.length > 0 && this.timeIndex > 0; }

  /** Redoes the last undone modifications. It requires enableHistory() to be called */
  private redo(): this {
    // Stops redoing when back to the present
    if(!this.redoable) { return this; }
    // Gets the previous snapshot from the history
    const snapshot = this.history[--this.timeIndex];
    // Removes the newest snapshot when back to the present
    if(this.timeIndex === 0) { this.history.shift(); }
    // Reloads the snapshot's content restoring the selection too
    return this.update(snapshot.value, ...snapshot.selection);
  }
}
