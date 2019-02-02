import { wmEditable, wmDocument, wmText, wmNodeType, wmAlignType, wmTextStyle } from './editable-types';
export * from './editable-types';

export class EditableContent<T extends wmEditable = wmEditable> {

  private node: T;
  private name: string;
  private parent: EditableContent;
  private children: EditableContent[] = [];
  private index: number = -1; 
  private depth: number = 0;

  private element: HTMLElement;
  private modified: boolean = false;

  constructor(data: T) { 
    this.node = data;
  }

  get data(): T { return this.node as T; }
  
  get type(): wmNodeType { return !!this.node ? this.node.type : undefined; }

  get text() { return this.type === 'text'; }
  get link() { return this.type === 'link'; }
  get editable() { return this.text || this.link; }

  get style(): wmTextStyle[] { return !!this.node ? ( (this.node as wmText).style || [] ) : []; } 

  public hasStyle(style: string) { return this.text && this.style.some( s => s === style ); }
  
  get bold() { return this.hasStyle('bold'); }
  get italic() { return this.hasStyle('italic'); }
  get underline() { return this.hasStyle('underline'); }
  get overline() { return this.hasStyle('overline'); }
  get strikethrough() { return this.hasStyle('strikethrough'); }
  get subScript() { return this.hasStyle('sub'); }
  get superScript() { return this.hasStyle('super'); }
  
  get align(): wmAlignType { return !!this.node ? this.node.align : undefined; }  
  
  get value(): string { return !!this.node ? (this.node as wmText).value : ''; }
  set value(text: string) { if(this.text || this.link) { (this.node as wmText).value = text; }}
  get length() { return this.text ? this.value.length : -1; }

  get id(): string { return !!this.name ? 'N'+this.name : undefined; }
  get content(): EditableContent[] { return this.children || []; }
  get count(): number { return this.content.length; }

  get hasChildren(): boolean { return this.count > 0;}
  get emptyChildren(): boolean { return this.content.every( node => node.empty ); }

  get empty(): boolean {
    // If node has just been removed
    //if(!this.type) { return true; }
    // If node has a text content
    if(this.length > 0) { return false; }
    // If node has no children
    if(this.count <= 0) { return true; }
    // If all children are empty
    return this.emptyChildren; 
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

  // Turns the content tree into an unformatted string
  public stringify(): string {

    return this.content.reduce( (txt: string, node: EditableContent) => {

      txt += node.text ? node.value.replace('\n', ' ') : '';
      txt += node.stringify();
      return txt;

    }, '');
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
   * Inherits the node coordinates from the specified parent
   * @param parent the parent node to inherit from
   * @param index the offset position within the children array
   */
  private inherit(parent: EditableContent, index: number): EditableContent {
     
    if(!parent) { return null; }
    // Position index
    this.index = index;
    // Parent node
    this.parent = parent;
    // Node depth
    this.depth = parent.depth + 1;
    // Node name
    this.name = !!parent.name ? `${parent.name}.${index}` : index.toString();
    return this;
  }

  /**
   * Creates a new node of the specified type
   * @param type the type of node to be created
   * @return the new node
   */
  public createNode(type: wmNodeType): EditableContent {
    return new EditableContent({ type });
  } 

  /**
   * Creates a new text node
   * @param text the text content
   * @return the new node
   */
  public createText(text: string) {
    const node = this.createNode('text');
    node.value = text;
    return node; 
  }

  public fromElement(el: HTMLElement): EditableContent {
    const name = !!el && !!el.id ? el.id.substring(1) : '';
    return this.walkTree(name);
  }

  /** Updates (aka create) the node children based on the source tree 
   * @param defer (optional) when true, it doesnt propagate the creation
   * down to further descendants
  *//*
  public update(defer: boolean = false): EditableContent<T> {

    if(this.hasChildren) {
      
      this.children = this.node.children
        // Wipes the children of undefined @see this.remove()
        .filter(node => !!node.type)
        .map( (node, i) => {
          // Wraps every child into an EditableContent instance 
          const child = new EditableContent(node);
          // Makes  it a child of this
          child.inherit(this, i);
          // Recurs along further descendants when not deferred
          return defer ? child : child.update();
      });
    }

    return this;
  }

  /** Marks the node type as undefined so it'll disappear during the next update round */
  /*public remove(): EditableContent {
    
    if(!this.node) { return null; } 
    this.node.type = undefined;
    return this;
  }*/

  static load(source: wmDocument): EditableContent<wmDocument> {

    if(!source) { return null; }

    // Creates the root node (document)
    const root = new EditableContent(source);
    // Build the tree
    return root.build();
  }

  private build(): EditableContent<T> {

    if(!!this.node && !!this.node.children) {
      
      this.children = this.node.children.map( (node, i) => {
        // Wraps every child into an EditableContent instance 
        const child = new EditableContent(node);
        // Makes  it a child of this
        child.inherit(this, i);
        // Recurs along further descendants
        return child.build();
      });
    }

    return this;
  }

  /** Refreshes children inheritance recurring along descendants 
   * @param from (optional) optionally start from a non-zero index 
  */
  private refresh(from: number = 0): EditableContent<T> {

    let i = from;
    for(let n = from; n < this.count; n++) {
      // Skips nodes marked for deletion
      if(!this.content[n].type) { continue; }
      // Updates node inheritance
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
    // Node comparison by name 
    if(this.name < node.name) { return -1; }
    if(this.name > node.name) { return +1; }
    return 0;
  }

  /** Compares whenever two nodes share the same type and format */
  public same(node: EditableContent): boolean {
    // Skips testing null objects
    if(!node) { return false; }
      // Links are never the same
    if(this.link ) { return false; }
    // Just compare types on non-text nodes
    if(!this.text) { return this.type === node.type; }
    // Makes sure both nodes are text
    if(node.text) { return false; }
    // Short-circuit if style are of different lengths
    if(this.style.length !== node.style.length) { return false; }
    // Compare the two style arrays
    return this.style.every( s1 => node.style.some( s2 => s1 === s2 ) );
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
  public commonAncestor(node: EditableContent): EditableContent {

    if(!node || !node.parent || !this.parent) { return null;}
    // If this node is deeper, walks up one level
    if(this.depth > node.depth) {
      return this.parent.commonAncestor(node);
    }
    // If the node is deeper, walks it up one level
    if(node.depth > this.depth) {
      return node.parent.commonAncestor(this);
    }
    // When at the same depth nodes do not share the same parent
    // walks both up one level
    if(this.parent !== node.parent) {
      return this.parent.commonAncestor(node.parent);
    }
    // Found!
    return this.parent;
  }

  public shareParent(node: EditableContent): boolean {
    
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
  private splice(start: number, count: number, ...items: EditableContent[]) {
    // Ensure the optionally added nodes inherit from this 
    if(!!items) { items.forEach( (n, i) => n.inherit(this, start + i)); }
    // Adjuts count to the max when negative
    count = count < 0 ? (this.count - start) : count;
    // Insert/remove children nodes as requested
    const nodes = this.content.splice(start, count, ...items);
    // Refreshes the shifted children
    this.refresh(start);
    // Return the removed nodes
    return nodes;
  }

  /** Removes this node from the tree */
  public remove(): EditableContent {

    if(!this.parent || !this.parent.childOfMine(this)) { return null; }
    
    return this.parent.splice(this.index, 1)[0];
  }

  /** Walks up the tree branch removing all the empty nodes */
  public prune(depth: number = 0) {
    // When node is empty
    if(this.depth > depth && this.empty) {
      // Removes this node from the tree
      this.remove();
      // Climbs the parent up to prune it when empty
      return !!this.parent ? this.parent.prune(depth) : null;
    }
    return this;
  }

  /** 
   * Append a child node updating the tree
   * @param node the new child
   */
  public appendChild(node: EditableContent): number {    
    return this.content.push(node.inherit(this, this.count).refresh());
  }

  /**
   * Insert a child node at a specified position shifting the other children
   * @param at the requested position
   * @param node the new node
   *//*
  private insertAt(at: number, node: EditableContent) {

    if(at > this.count) { return null; }
    // Adds the node shifting the others
    this.content.splice(at, 0, node.inherit(this, at));
    // Refreshes the shifted children (including the inserted one)
    this.refresh(at);
    
    return node;
  }*/

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
    return this.childOfMine(before) ? this.splice(before.index, 0, node)[0] : null;
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
    return this.childOfMine(after) ? this.splice(after.index + 1, 0, node)[0] : null;
  }

  /** 
   * Insert a sibling node after this one 
   * @param node the node to be inserted
   * @return the new inserted node or null in case this node has no parent
   */
  public insertNext(node: EditableContent): EditableContent {
    return !!this.parent ? this.parent.insertAfter(this, node) : null;
  }

  private childAt(index: number): EditableContent {
    return index >= 0 && index < this.count ? this.content[index] : null;
  }

  public lastChild(): EditableContent {
    return this.childAt(this.count-1);
  }

  public firstChild(): EditableContent{
    return this.childAt(0);
  }

  public lastDescendant(depth?: number): EditableContent {

    if(!!depth && depth <= this.depth) { return this; }

    const last = this.lastChild();
    return !!last ? last.lastDescendant(depth) : this;
  }

  public firstDescendant(depth?: number): EditableContent{
    
    if(!!depth && depth <= this.depth) { return this; }

    const first = this.firstChild();
    return !!first ? first.firstDescendant(depth) : this;
  }

  private stepBackward(min: number = 0, max?: number) {

    // Abort when exeeding the requested depth limits
    if(!this.parent || this.parent.depth < min) { return null; }

    if(this.index > 0) {
      return this.parent.childAt(this.index-1)
        .lastDescendant(max);
    }

    return this.parent.stepBackward(min, max);
  }

  private stepForward(min: number = 0, max?: number): EditableContent {

    // Abort when exeeding the requested depth limits
    if(!this.parent || this.parent.depth < min) { return null; }

    if(this.index < this.parent.count-1) {
      return this.parent.childAt(this.index+1)
        .firstDescendant(max);
    }

    return this.parent.stepForward(min, max);
  }

  /** Jumps to the previous sibling node */
  public previousSibling(): EditableContent {
    return this.stepBackward(0, this.depth);
  }

  /** Jumps to the next sibling node */
  public nextSibling(): EditableContent {
    return this.stepForward(0, this.depth);
  }

  /** Jumps to the previous editable node */
  public previousEditable(): EditableContent {
    return this.stepBackward();
  }

  /** Jumps to the next editable node */
  public nextEditable(): EditableContent {
    return this.stepForward();
  }

  /** 
   * Jumps to the previous text node
   * @param level the max depth up to the tree will be traversed while searching 
   *//*
  public previousText(level: number = 1): EditableContent {

    const prev = this.stepBackward(level);
    return !prev || prev.text ? prev : prev.previousText(level);
  }*/

  /** 
   * Jumps to the next text node
   * @param level the max depth up to the tree will be traversed while searching 
   *//*
  public nextText(level: number = 1): EditableContent {

    const next = this.stepForward(level);
    return !next || next.text ? next : next.nextText(level);
  }*/

  private position(name: string = this.name): number[] { 
    return !!name ? name.split('.').map( n => +n ) : [];
  }

  /** Traverse the tree till the node requested by name */
  public walkTree(name: string): EditableContent {
    // Turns the name into the node position
    const pos = this.position(name);
    // Walks the tree
    let node: EditableContent = this;
    for(let i = this.depth || 0; i < pos.length && !!node; i++) {
      node = node.childAt(pos[i]);
    }
    // Found it!
    return node;
  }

  public merge(node: EditableContent): EditableContent { 
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Reverts the operation if node comes before this
    if(this.compare(node) > 0) { return node.merge(this); }
    // Only when nodes share the same type and eventually style
    if(this.same(node)) { 
      // Join the texts when editable
      this.append(node.value); 
      // Removes the joint node
      node.remove();
    }
    // Stops here whenever the parents are missing
    if(!this.parent || !node.parent) { return this; }
    // Prepares to add/remove the sibling nodes. When the nodes share the same parent
    // we'll just need to remove the nodes in between. When the nodes belong to different
    // containers, children will be merged
    const same = this.shareParent(node);
    // Computes the number of nodes to be removed or replaced
    const count = same ? (node.index - this.index - 1) : -1;
    // Extracts the node's children to be appended
    const nodes = same ? [] : node.parent.splice(node.index, -1);
    // Joins the children nodes
    this.parent.splice(this.index + 1, count, ...nodes);
    // Done
    //if(same) { return this; }
    // Recurs up 
    return this.parent.merge(node.parent);
  }

  /** 
   * Merges the two nodes by type 
   * @param node the node to be merged with
  *//*
  public merge(node: EditableContent): EditableContent {
    // Skips the merging if the two nodes do not match
    if(!!node && this.type !== node.type) { return this; }
    // Climbs till the common ancestor
    const root = this.commonAncestor(node);
    // Merges its children
    return !!root ? root.mergeChildren() : this;
  }

  private mergeChildren(): EditableContent {
    // Merges when 2+ children only
    if(this.count < 2) { return this; }
    // Loops on the children
    this.content.reduce( (node, next) => {
      // Skips nodes marked for deletion
      if(!node.type) { return next; }
      if(!next.type) { return node; }
      // Merge nodes sharing the same type & style
      if( node.same(next) ) {
        // Merges the node value and content
        node.append(next.value);
        node.children = node.content.concat(next.content);
        // Marks the merged  node for deletion
        next.remove();
        // Recurs to merge node children
        return node.mergeChildren();
      }
      return next;
    });

    return this;
  }*/

  /** 
   * Merges the two nodes by value and content 
   * @param node the node to be merged with
  *//*
 public merge(node: EditableContent): EditableContent { 
  // Skips when null
  if(!!node) { return this; }
  // Merges editable node values
  if(this.editable) {
    // Only when nodes share the same type and style
    if(this.same(node)) { 
      // Join the texts and remove the node
      this.append(node.value); 
      node.remove();
    }
    // Done whenever the nodes share the same container, merge the containers otherwise
    return this.shareParent(node) ? this : this.parent.merge(node.parent);
  } 
  // Merging containers
  else {
    // Something wrong, so, do nothing
    if(node.editable) { return this; }
    // Joins the content when available
    if(node.hasChildren) {         
      this.children = this.content.concat(node.content);          
    }
    // Remove the node from the tree
    node.remove();
  }

  return this;
}*/

  /** 
   * Splits a text node into siblings
   * @param from offset where to split the text from
   * @param to (optional) offset where to split the text to
   * @return the first node resulting from the addition
   */
  public split(from: number, to?: number): EditableContent {
    // Only text node are splittable
    if(this.type === 'text') { 
      // When there's something to split at the tip...
      if(from > 0) {
        // Creates a new text node splitting the text content
        const node = this.createText( this.extract(from) );
        //...and inserts it after this node, than recurs to manage the tail
        return this.insertNext(node).split(0, to - from);
      }
      // When there's something to split at the tail...
      if(to > 0 && to < this.length-1) {
        // Creates a new text node splitting the text content 
        const node = this.createText( this.extract(0, to) );
        //...and inserts it before this node
        return this.insertPrevious(node);
      }
    }
    // Returns this node when done 
    return this;
  }
}

