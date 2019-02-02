import { wmEditable, wmText, wmTextStyle, wmEditableType, wmNodeType, wmAlignType } from './editable-types';

export type EditablePosition = number[];

export class EditableContent<T extends wmEditable = wmEditable> {

  protected node: T;
  protected parent: EditableContent;
  protected index: number = -1; 
  protected pos: EditablePosition = [];
  protected children: EditableContent[] = [];

  constructor(data: T) {
    this.node = data || {} as T;
  }

  get data(): T { return this.node; }
  
  get type(): wmNodeType { return this.node.type; }
  get align(): wmAlignType { return this.node.align || 'left'; }  

  get container(): EditableContent { return this.parent; }
  
  get content(): EditableContent[] { return this.children || []; }
  get count(): number { return this.content.length; }
  get first(): boolean { return this.index === 0; }
  get last(): boolean { return this.index === this.count - 1; }

  get depth(): number { return !!this.pos ? this.pos.length : 0; }
  get id(): string { return this.pos ? 'N'+this.pos.join('.') : '' ; }

  get empty(): boolean { return this.count <= 0; }
  
  /** Setting text value from cointainer is not supported */
  set value(text: string) { throw "Setting text value at container level is not supported";}
  
  /** Returns the text content of a branch by appending text node values recursively */
  get value(): string {

    return this.content.reduce( (txt: string, node: EditableContent) => {

      txt += node.value.replace('\n', ' ');
      return txt;

    }, '');
  }
  // Containers node lenght not supported to avoid performance issues
  get length() { return 0; }
  /** Structural nodes never chare the same atttributes */
  public same(node: EditableContent): boolean { return false; }
  /** Structural nodes never need to be joined */
  public join(node: EditableContent): EditableContent { return this; }

   /**
   * Creates a new node of the specified type
   * @param type the type of node to be created
   * @return the new node
   */
  public createNode(data: wmEditable): EditableContent {

    if(!data) { return null; }

    switch(data.type) {

      case 'text': case 'link':
      return new EditableText(data as wmText);
    }

    return new EditableContent(data);
  }

  protected build(node: wmEditable): EditableContent<T> {

    if(!!node && !!node.children) {
      
      this.children = node.children.map( (node, i) => {
        // Wraps every child into an EditableContent instance 
        const child = this.createNode(node);
        // Makes  it a child of this
        child.inherit(this, i);
        // Recurs along further descendants
        return child.build(node);
      });
    }

    return this;
  }

  /**
   * Inherits the node coordinates from the specified parent
   * @param parent the parent node to inherit from
   * @param index the offset position within the children array
   */
  private inherit(parent: EditableContent, index: number): EditableContent {
     
    if(!parent) { return null; }
    // Parent node
    this.parent = parent;
    // Position index -  Equivalent to the value of the last element in pos
    this.index = index;
    // Node absolute position within the tree
    this.pos = (parent.pos || []).concat(index);
    // Return this to support chaining
    return this;
  }

  /** Refreshes children inheritance recurring along descendants 
   * @param from (optional) optionally start from a non-zero index 
  */
  private refresh(from: number = 0): EditableContent<T> {

    let i = from;
    for(let n = from; n < this.count; n++) {
      this.content[n].inherit(this, i++);
      this.content[n].refresh();
    }
    return this;
  }

  /**
   * Compares two nodes position
   * @param node the node to be compared with
   * @return +1 when this comes first, -1 when node come first, 0 when they are the same node
   */
  public compare(node: EditableContent): number {
    // Short circuit on undedined node
    if(!node) { return undefined; }
    // Short circuit by node reference 
    if(this === node) { return 0; }
    // Compare by base positions (up to min depth)
    const len = Math.min(this.depth, node.depth);
    for(let i = 0; i < len;i++) {
      const value = this.pos[i] - node.pos[i];
      if(value < 0) { return -1; }
      if(value > 0) { return +1; }
    }
    // In case the share the same base position, compares by depth since the parent comes first
    const dep = this.depth - node.depth;
    if(dep < 0) { return -1;}
    if(dep > 0) { return +1;}
    // We should never come down here unless two different nodes have the same position
    return 0;
  }

  /** 
   * Returns an array of all the ancestors' types up to the specified depth 
   * @param depth the node level to drive the search up to. Specifying 'inline'
   * drives the search up to the level containing inline text nodes only
  */
  public ancestors(depth: number = 0): wmNodeType[] {
    // Stops when done
    if(!this.parent || this.depth <= depth) return [];
    // Walks up toward the root
    const ancestors = this.parent.ancestors(depth);
    // Append the parent type 
    ancestors.push(this.parent.type);
    return ancestors;
  }

  public ancestor(depth: number): EditableContent {
    // Skips wrong levels
    if(this.depth < depth) { return null; }
    // Stops when done
    if(this.depth === depth) { return this; }
    // Climbs to the next level
    return !!this.parent ? this.parent.ancestor(depth) : null;
  }

  /** 
   * Seeks for a common ancestor between this and the requested node 
   * @param node the node to be compared with
   * @return the common anchestor node or null
  */
  public common(node: EditableContent): EditableContent {

    if(!node || !node.parent || !this.parent) { return null; }
    // If this node is deeper, walks up one level
    if(this.depth > node.depth) {
      return this.parent.common(node);
    }
    // If the node is deeper, walks it up one level
    if(node.depth > this.depth) {
      return node.parent.common(this);
    }
    // When at the same depth nodes do not share the same parent
    // walks both up one level
    if(this.parent !== node.parent) {
      return this.parent.common(node.parent);
    }
    // Found!
    return this.parent;
  }

  public siblings(node: EditableContent): boolean {
    
    if(!node || !node.parent || !this.parent) { return false; }

    return this.parent === node.parent;
  }

  /** Checks if the requested node is among this children */
  public childOfMine(node: EditableContent): boolean {
    return node.index < this.count && this.content[node.index] === node;
  }

  /**
   * Splices the node content (children array) refreshing the siblings
   * @param start index of which starting to change the array
   * @param count (optional) number of old nodes to be removed. 
   * When negative all the nodes from start till the end will be removed.
   * @param items (optional) the new items to be added starting at start 
   */
  public splice(start: number, count: number, ...items: EditableContent[]) {
    // Adjusts count to the max when negative
    count = count < 0 ? (this.count - start) : count;
    if(count <= 0 && items.length <= 0) { return []; }
    // Insert/remove children nodes as requested
    const nodes = this.content.splice(start, count, ...items);
    // Refreshes the added and shifted children inheritance
    this.refresh(start);
    // Return the removed nodes
    return nodes;
  }

  /** Returns true whenever this node has been removed from the tree */
  get removed(): boolean {
    return !this.parent || !this.parent.childOfMine(this);
  }

  /** 
   * Removes this node from the tree recurring up along the tree
   * to remove empty ancestors if any.
   */
  public remove(): EditableContent {
    // Makes sure the node still belongs to its parent
    if(this.removed) { return null; }
    // Removes the node by index
    const node = this.parent.splice(this.index, 1)[0];
    // Recurs removing the parent if empty, returns otherwise
    return this.parent.empty ? this.parent.remove() : node;
  }

  /** 
   * Append a child node updating the tree
   * @param node the new child
   */
  public appendChild(node: EditableContent): number {    
    return this.content.push(node.inherit(this, this.count).refresh());
  }

  /** 
   * Replaces an existing child with a new node 
   * @param child the existing child node
   * @param node the new child node
   * @return the new inserted node or null whenever child was not a child of this
   */
  public replaceChild(child: EditableContent, node: EditableContent): EditableContent {
          
    if(!this.childOfMine(child)) { return null; }
    return this.content[child.index] = node.inherit(this, child.index).refresh();
  }

  /**
   * Inserts a node before the specified one
   * @param before the child node to shift
   * @param node the new child node to be inserted at before position
   * @return the new inserted node or null in case before was not a child of this
   */
  public insertBefore(before: EditableContent, node: EditableContent): EditableContent {    
    return this.childOfMine(before) ? (this.splice(before.index, 0, node), node) : null;
  }

  /** 
   * Insert a sibling node before this one 
   * @param node the node to be inserted
   * @return the new inserted node or null in case this node has no parent
  */
  public insertPrevious(node: EditableContent): EditableContent {
    return !!this.parent ? this.parent.insertBefore(this, node) : null;
  }

  /**
   * Inserts a node after the specified one
   * @param after the child node after wich to insert the new child
   * @param node the new child node to be inserted
   * @return the new inserted node or null in case after was not a child of this
   */
  public insertAfter(after: EditableContent, node: EditableContent): EditableContent {  
    return this.childOfMine(after) ? (this.splice(after.index + 1, 0, node), node) : null;
  }

  /** 
   * Insert a sibling node after this one 
   * @param node the node to be inserted
   * @return the new inserted node or null in case this node has no parent
   */
  public insertNext(node: EditableContent): EditableContent {
    return !!this.parent ? this.parent.insertAfter(this, node) : null;
  }

  /** Returns the child node at the specified position or null */
  public childAt(index: number): EditableContent {
    return index >= 0 && index < this.count ? this.content[index] : null;
  }

  /** Returns the last child node in this parent list */
  public lastChild(): EditableContent {
    return this.childAt(this.count-1);
  }

   /** Returns the first child node in this parent list */
  public firstChild(): EditableContent{
    return this.childAt(0);
  }

  /** Returns the deepest descendant of the last child */
  public lastDescendant(): EditableContent {
    const last = this.lastChild();
    return !!last ? last.lastDescendant() : this;
  }

  /** Returns the deepest descendant of the first child */
  public firstDescendant(): EditableContent{
    const first = this.firstChild();
    return !!first ? first.firstDescendant() : this;
  }

  /** 
   * Jumps to the previous sibling node.
   * @return the node immediately preceding this in its parent's list, 
   * or null if the specified node is the first
   */
  public previousSibling(): EditableContent {
    return (!!this.parent) ? this.parent.childAt(this.index-1) : null;
  }

  /** 
   * Jumps to the next sibling node.
   * @return the node immediately following this in its parent's list, 
   * or null if the specified node is the last
   */
  public nextSibling(): EditableContent {
    return (!!this.parent) ? this.parent.childAt(this.index+1) : null;
  }

  /**
   * Jumps to the previous node traversing the tree when necessary.
   * @param traverse (default = true) when false, behaves like previousSibling()
   * @return return the last descendant of the immediately preceding node
   * in its parent's list or jumps to the preceding parent sibling returning 
   * null when no more preceding node are available in the full tree.
   */
  public previous(traverse: boolean = true): EditableContent {
    if(!this.parent) { return null; }
    const sibling = this.previousSibling();
    if(!traverse) { return sibling; }
    return !!sibling ? sibling.lastDescendant() : this.parent.previous();
  }

  /**
   * Jumps to the next node traversing the tree when necessary.
   * @param traverse (default = true) when false, behaves like nextSibling()
   * @return return the first descendant of the immediately following node
   * in its parent's list or jumps to the following parent sibling returning 
   * null when no more following node are available in the full tree.
   */
  public next(traverse: boolean = true): EditableContent {
    if(!this.parent) { return null; }
    const sibling = this.nextSibling();
    if(!traverse) { return sibling; }
    return !!sibling ? sibling.firstDescendant() : this.parent.next();
  }

  private position(id: string): EditablePosition {
    return !!id ? id.replace(/[^0-9\.]+/g, '').split('.').map( n => +n ) : [];
  }

  /** Traverse the tree till the node requested by id */
  private walkTree(id: string): EditableContent {
    // Turns the element id into the node absolute position
    const pos = this.position(id);
    // Walks the tree
    let node: EditableContent = this;
    for(let i = this.depth || 0; i < pos.length && !!node; i++) {
      node = node.childAt(pos[i]);
    }
    // Found it!
    return node;
  }

  // Maps a given DOM node into the internal tree data node
  public fromDom(node: Node): EditableText {

    if(!node) { return null; }
    // If node is a text node we look for the node parent assuming 
    // its ID correctly maps the corresponding tree data node
    if(node.nodeType === Node.TEXT_NODE) {
      // Gets the text node parent elements
      // note: since IE supports parentElement only on Elements, we cast the parentNode instead
      const element = node.parentNode as Element;
      // Walks the tree searching for the node to return
      //return this.walkTree(!!element && element.id) as EditableText;
      const txt = this.walkTree(!!element && element.id) as EditableText;

      if(!txt || txt.type === 'text' || txt.type === 'link') { return txt; }

      debugger;

      return txt;
    }
    // If not, selection is likely falling between elements, so, 
    // we search for the first child element assuming its ID will do
    if(!node.hasChildNodes()) { return null; }
    // Let's search for the first element (so basically skipping comments)
    let child = node.firstChild as Node;
    while(!!child) {
      // Recurs on both elements and text nodes. This way will keep going till we reach
      // the very first text node within the deepest first element
      if(child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.TEXT_NODE) {
        return this.fromDom(child);
      }
      // Goes next
      child = child.nextSibling;
    }
    // Something wrong
    return null;
  }

  /** 
   * Remove branches between the two nodes
   * @param node the node to remove branches up to.
   * Both this and node won't be removed. 
   * @return the common ancestor pruning started from
   */
  public prune(node: EditableContent): EditableContent {
    // Reverts the operation if node comes in the wrong order
    if(this.compare(node) > 0) { return node.prune(this); }
    // Climbs up to the common ancestor
    const root = this.common(node);
    if(!!root) {
      // Computes the node relative positions
      const left = this.pos.slice(root.depth);
      const right = node.pos.slice(root.depth);
      // Starts pruning node in between positions
      return root._prune(left, right);
    }
    return null;
  }

  private _prune(left: EditablePosition, right: EditablePosition) {
    // Consumes left and right indexes
    const lx = !!left ? left.shift() : undefined;
    const rx = !!right ? right.shift() : undefined;
    // When both lx and rx are undefined we are done
    if(lx === undefined && rx === undefined) { return this; }
    // Remove children in between. This works assuming both indexes are child of this node
    if(lx !== undefined && rx !== undefined) {

      this.childAt(lx)._prune(left, undefined);
      this.childAt(rx)._prune(undefined, right);
      this.splice(lx + 1, Math.max(rx - lx - 1, 0) );
      // Done recurring
      return this;
    }
    // Remove children right
    if(lx !== undefined) {
      
      this.childAt(lx)._prune(left, undefined);
      this.splice(lx + 1, -1);
    }
    // Remove children left
    if(rx !== undefined) {

      this.childAt(rx)._prune(undefined, right);
      this.splice(0, rx);
    }

    return this;
  }

  /**
   * Defragments the tree content, so, text nodes are minimized
   * by joining siblings when sharing the same attributes
   */
  public defrag(): EditableContent {
    
    if(this.count <= 0) { return this; }

    let start = this.firstChild().defrag();

    for(let i = 1; i < this.count; i++) {

      const next = this.childAt(i).defrag();

      if(start.same(next)) { start.join(next); i--;}
      else { start = next; }
    }

    return this;
  }
}

/** Implements text nodes */
export class EditableText extends EditableContent<wmText> {

  private element: HTMLElement;
  private modified: boolean = false;

  constructor(data: wmText) { super(data); }

  // Returns the dom text node used when rendering
  public get domNode(): Node {
    // Returns the element's first child node
    return !!this.element ? this.element.firstChild : null;
  }

  get text() { return this.type === 'text'; }
  get link() { return this.type === 'link'; }

  get style(): wmTextStyle[] { return this.data.style || (this.data.style = []); } 

  public hasStyle(style: string) { return this.text && this.style.some( s => s === style ); }
  
  get bold() { return this.hasStyle('bold'); }
  get italic() { return this.hasStyle('italic'); }
  get underline() { return this.hasStyle('underline'); }
  get overline() { return this.hasStyle('overline'); }
  get strikethrough() { return this.hasStyle('strikethrough'); }
  get subScript() { return this.hasStyle('sub'); }
  get superScript() { return this.hasStyle('super'); }

  get value(): string { return this.node.value || ''; }
  set value(text: string) { this.node.value = text; }
  get length() { return this.value.length; }
  get empty(): boolean { return this.length <= 0;}
  //get emptish(): boolean { return this.empty || this.value.search(/[^\s]/) < 0;}

  /** Compares whenever two nodes share the same type and format */
  public same(node: EditableText): boolean {
    // Skips testing null or non text nodes (links are never the same)
    if(!node || node.type !== 'text' || this.type !== 'text') { return false; }
    // Short-circuit if style are of different lengths
    if(this.style.length !== node.style.length) { return false; }
    // Compare the two style arrays
    return this.style.every( s1 => node.style.some( s2 => s1 === s2 ) );
  }

  /** 
   * Joins the text values of node into this removing the former from the tree.
   * @return this node supoprting chaining.
   */
  public join(node: EditableText): EditableText {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Join the texts
    this.append(node.value);
    // Remove the empty node
    return node.remove(), this;
  }

  /**
   * Creates a new node of the specified type
   * @param type the type of node to be created
   * @return the new node
   */
  public createText(text: string, style?: wmTextStyle[]): EditableText {

    return this.createNode({ 
      type: 'text',
      value: text,
      style: !!style ? [...style] : []
    } as wmEditable) as EditableText;
  }

  /** Appends a new text */
  public append(text: string): string {
    return this.value += text;
  }

  /** Returns the text content up to the marker */
  public tip(till: number): string {
    if(till === 0) { return ''; }
    return !!till ? this.value.slice(0, till) : this.value;
  }

  /** Returns the text content from the marker till the end */
  public tail(from: number): string {
    if(from === 0) { return this.value; }
    return !!from ? this.value.slice(from) : '';
  }

  /** Inserts a text at the specified position or appends it at the end when the position is undefined */
  public insert(text: string, at?: number): string {
    return ( this.value = this.tip(at) + text + this.tail(at) );
  }

  /** Extracts the text content from/to the specified markers.
   * @param from position starting the extraction from
   * @param to (optional) position ending the extraction to. When not specified, the extraction goes till the end of the text. 
   * @return the extracted text modifying the node text as a consequence. 
   */
  public extract(from: number, to?: number): string {
    const ret = this.value.slice(from, to);
    this.value = this.tip(from) + this.tail(to);
    return ret;
  }

  /** Cuts the text content. This function complements @see extract.
   * @param till position to cut the tip of the text up to
   * @param from (optional) position to cut the tail of the text from
   */
  public cut(till: number, from?: number): string {
    const ret = this.tip(till) + this.tail(from);
    this.value = this.value.slice(till, from);
    return ret;
  }

  /** Clears the text content */
  public clear(): EditableContent {
    this.value = '';
    return this;
  }

  /** Renders the node value */
  public render(el: HTMLElement): string {
    // Hooks the node to the DOM element it renders in
    this.element = el;
    // Returns the value or a zero-with-space placehoder
    return this.value || '\u200B';
  }

  /** Syncs the node value with the element text contents */ 
  public sync(): string {

    if(!!this.element) {
      // Gets the element's inner text removing zero-width-spaces
      const text = (this.element.innerText || '').replace('\u200B', '');
      // Marks the node as modified when changes applied
      this.modified = this.modified || text !== this.value;
      // Updates thenode value
      this.value = text;
    }
    // Returns the updated value
    return this.value;
  }

  /** 
   * Jumps to the previous editable text node.
   * @param traverse (default = false) when true the previous node will be returned
   * traversing the full tree. It'll stop on the same parent's sibling otherwise 
   */
  public previousText(traverse: boolean = false): EditableText {

    let node = this.previous(traverse);
    if(!node) { return null; }
    //if(!traverse) { node = node.lastDescendant(); }
    return (node.type === 'text' || node.type === 'link') ? node  as EditableText : this.previousText(traverse);
  }

  /** 
   * Jumps to the next editable text node.
   * @param traverse (default = false) when true the next node will be returned
   * traversing the full tree. It'll stop on the same parent's sibling otherwise. 
   */
  public nextText(traverse: boolean = false): EditableText {

    let node = this.next(traverse);
    if(!node) { return null; }
    //if(!traverse) { node = node.firstDescendant(); }
    return (node.type === 'text' || node.type === 'link') ? node  as EditableText : this.nextText(traverse);
  }

  public format(style: wmTextStyle[]): EditableText {
    // Only text nodes can be formatted
    if(this.type !== 'text') { return this; }

    style.forEach( add => {

      if( this.style.every( style => style !== add )) {
        this.style.push(add);
      }
    });

    return this;
  }

  public unformat(style: wmTextStyle[]): EditableText {
    // Only text nodes can be formatted
    if(this.type !== 'text') { return this; }

    style.forEach( remove => {

      const index = this.style.findIndex( style => style === remove );
      if( index >= 0 ) { 
        this.style.splice(index, 1); 
      }
    });

    return this;
  }

  /** 
   * Merges the two nodes. Merging nodes immplies that the target node content
   * is appended to the source while all the tree nodes in between are removed 
   * from the tree. Text values are also joined when sharing the same styles.
   * @param node the node to be merged with
  */
  public merge(node: EditableText): EditableText {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Prunes the branches between the nodes, so, this and node are now siblings
    this.prune(node);
    // Whenever the nodes are not sharing the parent already...
    if(!this.siblings(node) || !this.parent || !node.parent) {
      // Removes the node parent from the tree (since is supposedly going to be empty)
      node.parent.remove();
      // Append the content of node to this
      this.parent.splice(this.parent.count, 0, ...node.parent.content);
    }
    // If target node is empty, makes sure it'll be merged 
    if(this.empty) { this.data.style = [...node.style]; }
    // Compares the node's styles to eventually join them
    if(this.same(node)) { this.join(node); }
    // Return this for chaining
    return this;
  }

  /** 
   * Splits a text node into siblings
   * @param from offset where to split the text from
   * @param to (optional) offset where to split the text to
   * @return the first node resulting from the addition
   */
  public split(from: number, to?: number): EditableText {
    // Only text node are splittable
    if(this.text) { 
      // Saturate till the end if to is not defined
      if(to === undefined) { to = this.length; }
      // When there's something to split at the tip...
      if(from > 0) {
        // Creates a new text node splitting the text content
        const node = this.createText( this.extract(from), this.style );
        //...and inserts it after this node, than recurs to manage the tail
        return (this.insertNext(node) as EditableText).split(0, to - from);
      }
      // When there's something to split at the tail...
      if(to > 0 && to < this.length) {
        // Creates a new text node splitting the text content 
        const node = this.createText( this.extract(0, to), this.style );
        //...and inserts it before this node
        return this.insertPrevious(node) as EditableText;
      }
    }
    // Returns this node when done 
    return this;
  }

  /** 
   * Inserts a new editable block of the specified type right
   * after this node to contain the following siblings, if any, 
   * or an empty text node otherwise.
   * @param type the typo  of editable to be inserted.
   * @param backward when true insert the new block preceding this node, inserts it following otherwise.
   * @return the new inserted block first child. 
   */
  public insertEditable(type: wmEditableType, backward: boolean = false): EditableText {
    // Skips the operation when not possible
    if(!this.parent) { return null; }
    // Creates the new node
    const editable = this.createNode({ type });
    if(!editable) { return null; }

    // Extracts the siblings to become the content of the new editable
    const content = backward ? this.parent.splice(0, Math.max(this.index - 1, 0))
      : this.parent.splice(this.index + 1, -1);

    // Pushes the new content when available or a new empty text node otherwise
    if(content.length > 0) { editable.splice(0, 0, ...content); }
    else { editable.appendChild( this.createText('') ); } 

    // Inserts the editable as this container sibling
    const node = backward ? this.parent.insertPrevious(editable)
      : this.parent.insertNext(editable);
    
    // Returns the new etitable first child
    return node.firstChild() as EditableText;
  }
}