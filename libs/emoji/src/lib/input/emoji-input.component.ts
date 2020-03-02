import { Component, Input, Output, EventEmitter, AfterViewChecked, OnChanges, OnDestroy } from '@angular/core';
import { HostBinding, HostListener, Inject, ElementRef, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { filter, map, timeInterval } from 'rxjs/operators';
import { EmojiText, emSegment } from '../text';
import { Subject, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { EmojiUtils } from '../utils';

@Component({
  selector: 'wm-emoji-input',
  templateUrl: './emoji-input.component.html',
  styleUrls: ['./emoji-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { "class": "wm-emoji-input" }
})
export class EmojiInput extends EmojiText implements AfterViewChecked, OnChanges, OnDestroy {

  // Current selection
  private start: number;
  private end: number;
  private marked: boolean;

  constructor(@Inject(DOCUMENT) private document: Document, private root: ElementRef<HTMLElement>, utils: EmojiUtils) {
    super(utils);
  }

  /** Returns the current selection in the for of start/end offset */
  public get selection(): [number, number] {
    return [ this.start, this.end ];
  }

  /** True whenever the curernt selection is collapsed in a cursor */
  public get collapsed(): boolean {
    return this.start === this.end;
  }

  /** Input's HTMLElement */
  public get element(): HTMLElement {
    return this.root.nativeElement;
  }

  /** The Window object */
  private get window(): Window {
    return this.document.defaultView;
  }

  /** True whenever the platform is Mac, iPhone or iPad */
  private get mac(): boolean {
    const window = this.document.defaultView;
    return /Mac|^iP/.test(window.navigator.platform);
  }

  /** True whenever this input has focus */
  public get focused(): boolean { 
    return this.document.activeElement === this.element; 
  }

  /** Sets the focus on the input's element */
  public focus() { this.element.focus(); }


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
  @Input('value') set input(value: string) {

    // Restarts the undo history whenevevr the input value changes. This test avoids unwanted resets when using bi-directional binding as well
    if(value !== this.value) { 
      this.enableHistory(this.historyTime, this.historyLimit); 
    }
    // Applies the new input value ihnerited by EmojiText
    this.updateValue(value);
  }
  
  /** Disables the input */
  @Input('disabled') set disableInput(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false; 

  /** Marks teh input as required */
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

  /** Emits the new text on changes */
  @Output() valueChange = new EventEmitter<string>();

  // Handles beforeinput event
  @HostListener('beforeinput', ['$event']) beforeInput(ev: InputEvent) { 
    // Divert the insertion content to the internal implementation
    if(ev.data) { this.query().insert(ev.data); }
    // Prevents the default behavior
    return false;
  }

  // Handles mouseup event
  @HostListener('mouseup', ['$event']) onMouseUp(ev: MouseEvent) {
    // Query for the current selection
    this.query();
  }

    // Handles mouseup event
  @HostListener('mousedown', ['$event']) onMouseDown(ev: MouseEvent) {
    // Query for the current selection
    this.query();
  }

  // Handles keydown event
  @HostListener('keydown', ['$event']) keyDown(ev: KeyboardEvent) {

    // Query for the current selection
    this.query();

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
      this.back(); break;

      // Insert a newline according to the newline input mode
      case 'Enter': if(this.newline === 'always' || (this.newline === 'shift' && ev.shiftKey)) { 
        this.insert('\n');
      }
      break;

      // Editing
      default: if(ev.key.length === 1 || this.utils.isEmoji(ev.key) ) {

        // Prevents keyboard repeating giving a chance to Mac's press&hold to work
        if(ev.repeat) { return false; }

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
      // Performs teh Redo unless its a Mac
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
    try { cp.setData('text', this.value.slice(this.start, this.end) ); }
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

  // Intercepts new renderings
  public ngAfterViewChecked() {
    // Applies the current selection to the document when needed. This is essential even when the selection
    // isn't modified since view changes (aka rendering) affects the selection that requires to be restored
    if(this.marked) {
      // Uses a promise to postpone the action after all teh current micro-tasks completed
      Promise.resolve().then( () => {
        // Emits the updated source text
        //this.valueChange.emit(this.value);
        // Makes sure to restore the selection after the view has been rendered but anyhow well before
        // the next change will be applied to the data tree (such as while typing) 
        this.apply();
        // Resets the flag after the update 
        this.marked = false; 
      });
    }
  }

  // Intercepts inpu changes
  public ngOnChanges(changes: SimpleChanges) {
    // Restarts the undo history (this resets teh buffer too)
    if(changes.historyTime || changes.historyLimit) {
      this.enableHistory(this.historyTime, this.historyLimit);
    }
    // Compiles the input text into segmetns to be rendered by the base class
    (changes.input || changes.mode) && this.compile(this.value);
  }

  // Clears the history while leaving 
  public ngOnDestroy() { this.clearHistory(); }

  /** Updates the value emitting the relevant valueChange event */
  private updateValue(value: string) {
    // Emits the updated source text
    return this.valueChange.emit(this.value = value), value;
  }

  /** Compiles the input text into segment accounting for multiple lines */
  public compile(source: string): number {
    // Appends an extra '\n' forcing the browser displaying a new line normally omitted when at the end
    // On native behavior this just adds an extra char to render while on web behavior dds an extra segment
    return super.compile(source + (source && source.endsWith('\n') ? '\n' : ''));
  }

  /** Helper function simulalting typing into the input box */
  public typein(key: string) {
    // Whenever focused, queries for the current selection and insert the given key
    this.focused && this.query().insert(key);
  }

  /** Insert a new text at the current cursor position */
  public insert(ins: string) {
    // Stores the current values in history
    this.store();
    // Deletes the selection, if any
    if(!this.collapsed) { this.del(); }
    // Insert the new text at the current position  
    const text = this.value.slice(0, this.start) + ins + this.value.slice(this.start);
    // Updates the source and compiles the segment for rendering 
    this.compile(this.updateValue(text));
    // Updates the cursor position
    this.end = (this.start += ins.length);
    // Marks the selection for restoration after rendering 
    this.marked = true;
  }

  /** Deletes the current selection (Del-like) */
  public del() {
    // Stores the current values in history
    this.store();
    // Whenevevr collapsed...
    if(this.collapsed){
      // Skips when at the end of the text
      if(this.end === this.value.length) { return; }
      // Moves the end side of the selection ahead otherwise
      this.end = this.next(this.end);
    } 
    // Removes the selected text
    const text = this.value.slice(0, this.start) + this.value.slice(this.end);
    // Updates the source and compiles the segment for rendering 
    this.compile(this.updateValue(text));
    // Collapses the selection
    this.end = this.start;
    // Marks the selection for restoration after rendering 
    this.marked = true;
  }

  /** Deletes the previous character (Backspace-like) */
  public back() {
    // Stores the current values in history
    this.store();
    // Whenevevr collapsed...
    if(this.collapsed) {
      // Skips when at the start of the text
      if(this.start <= 0) { return; } 
      // Moves the start side of the selection back otherwise
      this.start = this.prev(this.start);
    }
    // Deletes the selected block 
    this.del();
  }

  /** Moves the given selection index ahead by one character */
  private next(pos: number): number { 
    // Moving ahead requires to jump one or more character depending on the letngh of the emoji, if any.
    // So, search for a match with an emoij, first
    const match = this.utils.matchEmojiCodes(this.value.slice(pos));
    // Updates teh position accordingly
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

  /** Queries the current selection */
  public query(): this {

    try {
      // Gets the current document selection first
      const sel = this.document.getSelection();
      // Gets the first range, if any
      const range = (!!sel && sel.rangeCount > 0) && sel.getRangeAt(0);
      if(range) {
        // Computes the start offset
        this.start = this.offset(range.startContainer, range.startOffset);
        // Computes the end offset
        this.end = range.collapsed ? this.start : this.offset(range.endContainer, range.endOffset);
      }
      else { this.start = this.end = 0; }
    }
    catch(e) { this.start = this.end = 0; /*console.error(e);*/ }
    // Returns this for chaining purposes
    return this;
  }

  /** Restores the current selection back to the dom assuming the selection is now collapsed into a cursor */ 
  private apply(): this {

    try {
      // Gets the document selection object first
      const sel = this.document.getSelection();
      // Clears the current documetn selection
      sel.removeAllRanges();
      // Creates a new range
      const range = this.document.createRange();
      // Computes the node/offset pair
      const [node, offset] = this.range(this.start);
      // Applies the pair to the range as a collapsed selection
      range.setStart(node, offset);
      range.setEnd(node, offset);
      // Updated the docuemtn selection
      sel.addRange(range);
    }
    catch(e) {}
    // Returns this for chaining purposes
    return this;
  }

  /** Forces the cursor position to fall right before or after the emoji image the user clicked onto */
  public cursorAt(segment: emSegment, at: 'left'|'right') {

    // Updates the current cursor position based on the emoji image the user clicked onto
    this.start = this.end = this.abs(segment, at === 'right' ? segment.content.length : 0);
    this.marked = true;
  }

  /** Computes the absolute text offset from the Node/offset dom selection pair */  
  private offset(node: Node, offset: number): number {
    // Short-circuits for invalid nodes
    if(!node) { return 0; }

    // Case #1: The given node is a text node.
    // This means the dom selection is expressed as the text-node and the relative offset whithin such text
    if(node && node.nodeType === Node.TEXT_NODE) {
      // Computes the absolute offset from the matching segment
      return this.abs(this.segments[ this.findIndex(node) ], offset );
    }

    // Cases #2/3: The given node is an Element (must be the host container)
    // This means the dom selection is expressed as the containing node while the offseet is the index of 
    // the selected element, so, gets the selected child node first (saturating to the last child)
    node = node && node.childNodes.item(Math.min(offset, node.childNodes.length - 1));

    // Case #2: The selected child node is not an element (likely a comment)
    if(node && node.nodeType !== Node.ELEMENT_NODE) {
      // Walk back till the first element is found
      while(node && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.previousSibling;
      }
      // When found, computes the absolute offset fromn the matching segment using its content's lenght as the offset
      const segment = this.segments[this.findIndex(node)];
      return this.abs(segment, segment && segment.content.length);
    }

    // Case #3: The selected child node is an element (likely an image)
    // Computes the absolute offset from the matching segment straight away
    return this.abs(this.segments[this.findIndex(node)], 0);    
  }

  /** Computes a Node/offset dom selection pair from an absolute offset */
  private range(start: number): [ Node, number ] {

    // Splits the offset into the index of the relevant segment and a relative offset within the segment's content 
    const [index, offset] = this.split(start);

    // Starts with the first child node of the input's element
    let node = this.element.firstChild;
    // Seeks for the relevan node matching the index
    let i = 0;let count = 0;
    while(node) {
      // Counts text nodes and elements only (skips comments)
      if(node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
        // Stops at the requested index
        if(i === index) { break; }
        // Increases the searching index otherwise
        i++;
      }
      // Counts the number of child nodes otherwise (including comments)
      count++;
      // Goes to the next sibling
      node = node.nextSibling;
    }

    // Case #1: When no matching node is found, returns a 0 based index
    if(!node) { return [this.element, 0]; }

    // Case #2: When the matching node is a text node...
    if(node.nodeType === Node.TEXT_NODE) {
      // Returns the text node kind of selection with the content based offset
      return [ node, offset ];
    }
    
    // Case #3/4: The matching node is not a text. An offset means the next node must be selected 
    if(offset > 0) { 

      // Seeks for the next valid node 
      do { count++; node = node.nextSibling; }
      while(node && node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE) ;

      // Case #3: The next node is a text node
      if(node && node.nodeType === Node.TEXT_NODE) {
        // Returns the starting position of the text node itself 
        return [ node, 0 ];
       }
    }

    // Case #4: The Mathing node (or its the next valid node) is an element, so, returns its position relative to the parent
    return [ this.element, count ];
  }

  /** Selection helper function. Returns the index of the segment currently representing the given dom node */
  private findIndex(node: Node): number {
    // Short-circuits for invalid nodes
    if(!node || node.parentNode !== this.element) { return 0; }
    // Walks back till reaching the very first container's node
    let count = 0;
    while(node && node !==  this.element.firstChild) { 
      // Skips to the previous node
      node = node.previousSibling; 
      // Counts the valid node only
      if(node && (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)) {
        count++;
      }
    }
    // Returns the counting
    return count;
  }

  /** Selection helper function: Computes teh absolute offset from the given segment and relative offset */
  private abs(segment: emSegment, offset: number = 0): number {
    // Skips invalid segments
    if(!segment) { return 0; }
    // Loops on all teh segments
    for(let seg of this.segments) {
      // Stops when the requested segment matches
      if(segment === seg) { break; }
      // Accumulates the offset by the segment's content length
      offset += (seg.content || '').length;
    }
    // Returns the accumulated offset
    return offset;
  }

  /** Selection helper function: Splits an absolute offset into the index position of the related segment and its relative offset */
  private split(offset: number): [number, number] {
    // Loops on all the segments
    let index = 0;
    for(let seg of this.segments) { 

      // Stops whenever the offset falls into the segment
      if(offset <= (seg.content || '').length) { return [ index, offset ]; }
      // Decreases the offset by the segment's content length
      offset -= (seg.content || '').length;
      // Increases the segment indeg
      index++;
    }
    // Returns 0 on no matches found
    return [0, 0];
  }

  /***** HISTORY UNDO/REDO *****/
  private store$ = new Subject<{ value: string, selection: [number, number] }>();
  private history: { value: string, selection: [number, number] }[];
  private timeIndex: number;
  private sub$: Subscription;

  /** Clears the history buffer */
  public clearHistory(): this {
    // Unsubscribe the previous subscription, if any
    if(!!this.sub$) { this.sub$.unsubscribe(); }
    // Initializes the history buffer
    this.timeIndex = 0;
    this.history = [];
    return this;
  }

  /** Initilizes the history buffer */
  public enableHistory(debounce: number = 1000, limit: number = 128): this {
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
  public store(force?: boolean): this { 

    if(!!force) {
      // Pushes a snapshot into the history buffer unconditionally
      this.history.unshift({ value: this.value, selection: this.selection }); 
      return this; 
    }
    // Pushes the document for conditional history save
    this.store$.next({ value: this.value, selection: this.selection });
    return this; 
  }
 
  /** Returns true whenever the last modifications can be undone */
  get undoable(): boolean { return this.history.length > 0 && this.timeIndex < this.history.length - (!!this.timeIndex ? 1 : 0); }

  /** Undoes the latest changes. It requires enableHistory() to be called */
  public undo(): this {
    // Stops undoing when history is finished
    if(!this.undoable) { return this; }
    // Saves the present moment to be restored eventually
    if(this.timeIndex === 0) { this.store(true); }
    // Gets the latest snapshot from the history
    const snapshot = this.history[++this.timeIndex];
    // Reloads the snapshot's content restoring the selection too
    return this.restore(snapshot);
  }

  /** Returns true whenever the last undone modifications can be redone */
  get redoable(): boolean { return this.history.length > 0 && this.timeIndex > 0; }

  /** Redoes the last undone modifications. It requires enableHistory() to be called */
  public redo(): this {
    // Stops redoing when back to the present
    if(!this.redoable) { return this; }
    // Gets the previous snapshot from the history
    const snapshot = this.history[--this.timeIndex];
    // Removes the newest snapshot when back to the present
    if(this.timeIndex === 0) { this.history.shift(); }
    // Reloads the snapshot's content restoring the selection too
    return this.restore(snapshot);
  }

  /** Restores the input content fromn the given history record */
  private restore(snapshot: { value: string, selection: [number, number] }): this {

    this.compile(this.updateValue(snapshot.value));
    [this.start, this.end] = snapshot.selection;
    this.marked = true;
    return this;
  }
}