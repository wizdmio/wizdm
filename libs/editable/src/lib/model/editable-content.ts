import { wmEditable, wmParent, wmNodeType, wmIndentType, wmSizeLevel, wmAlignType, wmTextStyle } from './editable-types';
import { EditableFactory, EditableTypes } from './editable-factory';

export type EditablePosition = number[];

export abstract class EditableContent<T extends wmEditable = wmEditable> {

  protected node: T;
  protected parent: EditableContent;
  protected index: number = -1; 
  protected position: EditablePosition = [];
  protected children: EditableContent[] = [];

  constructor(readonly create: EditableFactory, data: T) { this.node = data || {} as T; }

  /** Returns the parent container */
  get container(): EditableContent { return this.parent; }
  /** Returns the node private data */
  get data(): T { return this.node; }
  /** Returns the node type */
  get type(): wmNodeType { return this.node.type; }
  /** Sets/gets the node alignement */
  set align(align: wmAlignType) { }
  get align(): wmAlignType { return null; }
  /** Sets/gets the node level */
  get level(): wmSizeLevel { return 0; }
  set level(level: wmSizeLevel) { }
  /** Returns the array of children */
  get content(): EditableContent[] { return this.children || (this.children = []); }
  /** Returns the number of child nodes */
  get count(): number { return this.content.length; }
  /** Return the node depth within the tree */
  get depth(): number { return (this.position || []).length; }
  /** Returns the node unique ID based on node absolute position in the tree */
  get id(): string { return 'N'+(this.position || []).join('.'); }
  /** Returns true wheneer this node has no content */
  get empty(): boolean { return this.content.every( child => child.empty ); }
  /** Returns true whenever this node has been removed from the tree */
  get removed(): boolean { return !this.parent || !this.parent.childOfMine(this);}
  /** Returns true wheneve this node is the only child within its parent */
  get alone(): boolean { return this.removed || this.parent.count <= 1; }
  /** Returns true whenever the node is the first child within its parent */
  get first(): boolean { return !this.removed && this.index === 0; }
  /** Returns true whenever the node is the last child within its parent */
  get last(): boolean { return !this.removed && this.index === this.parent.count - 1; }  
  /** Sets/Gets the text value of all the content nodes */
  set value(text: string) { this.set(text); }
  get value(): string { return this.content.reduce( (txt, node) => txt + node.value + node.pad, '');}
  /** Returns the appropriate pad character to terminate the node value */
  get pad(): string { return this.last ? '' : '\n'; }
  /** Returns the value's length */
  get length(): number { return this.value.length; }
  /** Sets/Fets the style array for the content */
  set style(style: wmTextStyle[]) { this.content.forEach( node => node.style = style ); }
  get style(): wmTextStyle[] { return this.count > 0 ? this.firstChild().style : []; } 
  /** Return the associated irl, if any */
  get url(): string { return ''; }
  /** Initializes the node data */
  public init(data: T): this { return (this.node = data), this; }
  /** Sets the text value of the contained nodes returning this for chaining */
  public set(text: string): this { return this.content.forEach( node => node.value = text ), this; }

  // Text specifics passively implemented 
  public append(text: string): string { return ''; }
  public tip(till: number): string { return ''; }
  public tail(from: number): string { return ''; }
  public insert(text: string, at?: number): string { return ''; }
  public extract(from: number, to?: number): string { return ''; }
  public cut(till: number, from?: number): string { return ''; }
  public edges(index: number): [number, number] { return [0,0]; }
  public split(from: number, to?: number): this { return this; }
  public link(url: string): this { return this; }
  public break(): this { return this; }
  // Recursively apply or unapply text formatting to the content 
  public format(style: wmTextStyle[]): this { return this.content.forEach( node => node.format(style) ), this;}
  public unformat(style: wmTextStyle[]): this { return this.content.forEach( node => node.unformat(style) ), this;}
  // Disable joining and defragment on structural nodes
  public join(node: EditableContent): this { return this; }
  public same(node: EditableContent): boolean { return false; }
  /** 
   * Merges the two nodes. Merging nodes implies that the target node content
   * is appended to the source while all the tree nodes in between are removed 
   * from the tree. Text values are also joined when sharing the same styles.
   * @param node the node to be merged with
  */
  public merge(node: EditableContent): this {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Prunes the branches between the nodes, so, this and node are now siblings
    this.prune(node);
    // Whenever the nodes are not sharing the parent already...
    if(!this.siblings(node) && !!this.parent && !!node.parent) {
      // Removes the node parent from the tree (since is supposedly going to be empty)
      node.parent.remove();
      // Append the content of node to this
      this.parent.splice(this.parent.count, 0, ...node.parent.content);
    }
    // Return this for chaining
    return this;
  }
  /** Loads the source document building the data tree */
  public load(source: T): this {
    // Assigns the source to the node data
    if(!!this.init(source).node && "content" in this.data) {
      // Recurs on children
      this.children = (this.node as wmParent).content.map( (node, i) => {
        // Creates the children nodes of the requested type
        return this.create.node(node as any)
          // Links it to the parent
          .inherit(this, i)
          // Recurs down the tree
          .load(node as any);
      });
    }

    return this;
  }
  /**
   * Inherits the node coordinates from the specified parent
   * @param parent the parent node to inherit from
   * @param index the offset position within the children array
   */
  private inherit(parent: EditableContent, index: number): this {
     
    if(!parent) { return null; }
    // Parent node
    this.parent = parent;
    // Position index -  Equivalent to the value of the last element in pos
    this.index = index;
    // Node absolute position within the tree
    this.position = (parent.position || []).concat(index);
    // Return this to support chaining
    return this;
  }
  /** Refreshes children inheritance recurring along descendants 
   * @param from (optional) optionally start from a non-zero index 
   */
  private refresh(from: number = 0): this {

    // Refreshes the content inheritance after any update
    for(let i = from; i < this.count; i++) {
      this.content[i].inherit(this, i).refresh();
    }
    return this;
  }
  /** Clones a node with or whithout its children */
  public clone(withChildren: boolean = true): this { 
    return this.create.clone(this as EditableTypes, withChildren) as this; 
  }
  /**
   * Compares two nodes position
   * @param node the node to be compared with
   * @return +1 when this comes first, -1 when node come first, 0 when they are the same node
   */
  public compare(node: EditableContent): -1|0|1 {
    // Short circuit on undedined node
    if(!node) { return undefined; }
    // Short circuit by node reference 
    if(this === node) { return 0; }
    // Compare by base positions (up to min depth)
    for(let i = 0; i < Math.min(this.depth, node.depth); i++) {
      const value = this.position[i] - node.position[i];
      if(value < 0) { return -1; }
      if(value > 0) { return +1; }
    }
    // In case the share the same base position, compares by depth since the parent comes first
    if(this.depth < node.depth) { return -1;}
    if(this.depth > node.depth) { return +1;}
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

  public climb(...types: wmNodeType[]): EditableContent {
    if(!types || !this.parent) { return null; }
    return types.some( type => type === this.type ) ? this : this.parent.climb(...types);
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
  /** Returns true whenever the tow nodes belongs to the same cocntainer */
  public siblings(node: EditableContent): boolean {
    
    if(!node || !node.parent || !this.parent) { return false; }
    return this.parent === node.parent;
  }
  /** Checks if the requested node is among this children */
  public childOfMine(node: EditableContent): boolean {
    return !!node && node.index < this.count && this.content[node.index] === node;
  }
  /** Checks if the requested node is among this descendants */
  public descendantOfMine(node: EditableContent): boolean {
    return !!node && (this.childOfMine(node) || this.content.some( child => child.descendantOfMine(node) ));
  }

  public findIndex(child: EditableContent): number {
    return this.childOfMine(child) ? child.index : -1;
  }
  /**
   * Splices the node content (children array) refreshing the siblings
   * @param start child or index of which starting to change the array
   * @param count (optional) number of old nodes to be removed. 
   * When negative all the nodes from start till the end will be removed.
   * @param items (optional) the new items to be added starting at start 
   */
  public splice(start: number|EditableContent, count: number, ...items: EditableContent[]) {
    // Extracts the starting index
    const index = typeof start === 'number' ? start : start.index;
    // Adjusts count to the max when negative
    count = count < 0 ? (this.count - index) : count;
    if(count <= 0 && items.length <= 0) { return []; }
    // Insert/remove children nodes as requested
    const nodes = this.content.splice(index, count, ...items);
    // Syncs the data children accordingly
    if(this.count) { (this.data as wmParent).content = this.content.map( node => node.data ); }
    // Refreshes the added and shifted children inheritance
    this.refresh(index);
    // Return the removed nodes
    return nodes;
  }
  /** Wraps the node with the specified container updating the hierarchy, if any*/
  public wrap(type: wmNodeType): EditableContent {
    // Creates a new node to wrap this node with
    const wrap = this.create.node({ type } as any);
    // Replaces the current node with the new wrapper within the parent content 
    if(!this.removed) { this.parent.splice(this, 1, wrap); }
    // Appends the node to the wrapper
    wrap.splice(0, 0, this);
    // Returns the wrapping node
    return wrap;
  }

  public unwrap(): EditableContent {
    // Skips unwrapping removed nodes
    if(this.removed) { return this; }
    // Relocates the node content into the parent container
    this.parent.splice(this, 1, ...this.content );//.splice(0, -1) );
    // Return the container node the unwrapped content now belongs to
    return this;
  }
  /** 
   * Removes this node from the tree recurring up along the tree
   * to remove empty ancestors if any.
   */
  public remove(): EditableContent {
    // Makes sure the node still belongs to its parent
    if(this.removed) { return null; }
    // Removes the node by index
    const node = this.parent.splice(this, 1)[0];
    // Recurs removing the parent when empty
    if(this.parent.empty) { this.parent.remove(); }
    // Returns the removed node
    return node;
  }
  /** 
   * Append a child node updating the tree
   * @param node the new child
   * @return the new appended node
   */
  public appendChild(node: EditableContent): EditableContent {
    // Pushes the node into the content array
    return this.splice(this.count, 0, node), node;
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
   * Inserts a node after the specified one
   * @param after the child node after wich to insert the new child
   * @param node the new child node to be inserted
   * @return the new inserted node or null in case after was not a child of this
   */
  public insertAfter(after: EditableContent, node: EditableContent): EditableContent {  
    return this.childOfMine(after) ? (this.splice(after.index + 1, 0, node), node) : null;
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

  /** Returns the value's length from the very first node up to the preceding sibling */
  get offset(): number {
    // Done when no more parents
    if(this.removed) { return 0; }
    // Accumulate the length of the preceding siblings
    let offset = 0;
    for(let i = 0; i < this.index; i++) {
      const node = this.parent.content[i];
      offset += (node.value + node.pad).length;
    }
    // Returns the offset recurring up the tree
    return offset + this.parent.offset;
  }
  /** Moves from the current node towards the sibling leafs based on the absolut value position */
  public move(offset: number): [EditableContent, number] {
    // Gets a reference to this nodes
    let node: EditableContent = this as any;
    // Jumps on previous nodes whenever the new offset crossed 0
    while(offset < 0) {
      // Jumps on the previous node traversing the full tree
      const prev = node.previous(true);
      // If null, we are done
      if(!prev) { offset = 0; break; }
      // When crossing text containers, account for the new line
      if(!prev.siblings(node)) { offset++; }
      // Adjust the offset according to node length
      offset += prev.length;
      // Loop on the next node
      node = prev;
    }
    // Jumps on next nodes whenever the new offset cossed the  node length
    while(offset > node.length) {
      // Jumps on the next node traversing the full tree
      const next = node.next(true);
      // If null, we are done
      if(!next) { offset = node.length; break; }
      // When crossing text containers, account for the new line
      if(!next.siblings(node)) { offset--; }
      // Adjust the offset according to node length
      offset -= node.length;
      // Loop on the next node
      node = next;
    }
    // Return the new node/offset pair
    return [node, offset]; 
  }
  /** Traverse the tree till the node requested by id */
  public walkTree(id: string): EditableContent {
    // Turns the element id into the node absolute position
    const pos = !!id ? id.replace(/[^0-9\.]+/g, '').split('.').map( n => +n ) : [];
    // Walks the tree
    let node: EditableContent = this;
    for(let i = this.depth || 0; i < pos.length && !!node; i++) {
      node = node.childAt(pos[i]);
    }
    // Found it!
    return node;
  }
  /** Helper function to perform depth-first lke tree traversal minimizing the number of traversed node */
  private traverse(node: EditableContent, callbackfn: (left: EditablePosition, right: EditablePosition) => EditableContent): EditableContent {
    // Skips on null or invalid parameters
    if(!node || typeof callbackfn !== 'function') { return null; }
    // Short-circuits when traversing the very same node
    if(this === node) { return callbackfn.call(this, [], []); }
    // Reverts the operation if node comes in the wrong order
    if(this.compare(node) > 0) { return node.traverse(this, callbackfn); }
    // Climbs up to the common ancestor
    const root = this.common(node);
    if(!!root) {
      // Computes the node relative positions
      const left = this.position.slice(root.depth);
      const right = node.position.slice(root.depth);
      // Starts traversing by calling the callback function on the root node
      return callbackfn.call(root, left, right);
    }
    return null;
  }
  /** 
   * Remove branches between the two nodes
   * @param node the node to remove branches up to.
   * Both this and node won't be removed. 
   * @return the common ancestor pruning started from
   */
  public prune(node: EditableContent): EditableContent {
    // Depth-first traversal
    return this.traverse(node, this._prune);
  }

  private _prune(left: EditablePosition, right: EditablePosition) {
    // Consumes left and right indexes
    const lx = !!left ? left.shift() : undefined;
    const rx = !!right ? right.shift() : undefined;
    // When both lx and rx are undefined we are done
    if(lx === undefined && rx === undefined) { return this; }
    // Depth-first traversal with post-order, recurs on left partial branch first
    lx !== undefined && this.childAt(lx)._prune(left, undefined);
    // Recurs on the right partial branch second
    rx !== undefined && this.childAt(rx)._prune(undefined, right);
    // Removes the full nodes in between last
    const start = lx !== undefined ? lx + 1 : 0;
    const count = rx !== undefined ? Math.max(rx - start, 0) : -1;
    this.splice(start, count);
    // Done recurring
    return this;
  }
  /** 
   * Return a copy of the tree between the two nodes (includes) as a document fragment 
   * so always reflecting a document(/block)/item/text hierarchy
   */
  public fragment(node: EditableContent): EditableContent {
    // Depth-first traversal
    let fragment = this.traverse(node, this._fragment);
    // Return null if something wrong
    if(!fragment) { return null; }
    // Check on the fragment root node type
    switch(fragment.type) {
      // When the root node is already a document, we are done
      case 'document': break;
      // Wraps cells/rows in tables
      case 'cell':
      fragment = fragment.wrap('row');
      case 'row':
      fragment = fragment.wrap('table').wrap('document');
      break;
      // Wraps images in figures
      case 'image': case 'caption':
      fragment = fragment.wrap('figure').wrap('document');
      break;
      // Wraps literals in paragraphs
      case 'text': case 'link':
      fragment = fragment.wrap('paragraph').wrap('document');
      // Wraps everything else in a document
      default:
      fragment = fragment.wrap('document');
    }
    // Returns a consistent document fragment
    return fragment;
  }

  private _fragment(left: EditablePosition, right: EditablePosition): EditableContent {
    // Consumes left and right indexes
    const lx = !!left ? left.shift() : undefined;
    const rx = !!right ? right.shift() : undefined;
    // Clones the root node without children
    const node = this.clone(false);
    // Done
    if(lx === undefined && rx === undefined) { return node; }
    // Depth-first Traversal, appends the left partial branch first
    lx !== undefined && node.appendChild( this.childAt(lx)._fragment(left, undefined) )
    // Appends the full branches in between
    const from = lx !== undefined ? lx + 1 : 0;
    const till = rx !== undefined ? rx : this.count;
    for(let i = from; i < till; i++) {
      node.appendChild( this.childAt(i).clone() );
    }
    // Appends the right partial branch last
    rx !== undefined && node.appendChild( this.childAt(rx)._fragment(undefined, right) );
    // Done recurring
    return node;
  }
  /** Cleaves the tree between this node and the next sibling climbing up till the root node*/
  public cleave(): EditableContent {
    // Done when removed or we reached the top 
    if(this.removed || this.depth === 1) { return this; }
    // Gets the next sibling node
    const next = this.nextSibling();
    if(!!next) {
      // Relocates the node from the next sibling foreward to a new branch
      this.parent.insertNext( this.parent.clone(false) )
        .splice(0, 0, ...this.parent.splice(next, -1));
    }
    // Climbs up the tree
    return this.parent.cleave();
  } 
  /**
   * Defragments the tree content, so, text nodes are minimized
   * by joining siblings when sharing the same attributes
   */
  public defrag(): EditableContent {
    // Skips empty containers
    if(this.count <= 0) { return this; }
    // Starts by recurring on the first child
    let start = this.firstChild().defrag();
    // Loops on the sibling children
    for(let i = 1; i < this.count; i++) {
      // Recurs down every sibling
      const next = this.childAt(i).defrag();
      // Compare the two sibling nodes to join them eventually  
      if(start.same(next)) { start.join(next); i--;}
      else { start = next; }
    }
    // Returs this for chaining
    return this;
  }

  public indent(type: wmIndentType): EditableContent {
    // Skips on invalid nodes
    if(this.removed) { return this; }
    // Checks on the preceding sibling
    const prev = this.previousSibling();
    // Appends the node on the prececding siblings when matching the same block type,
    // or wraps it in a new block otherwise 
    const block = (!!prev && prev.type === type) ? (prev.appendChild( this.remove() ), prev) : this.wrap(type);
    // Checks on the following sibling
    const next = block.nextSibling();
    // Merges the next sibling bloxk when matching the same type
    if(!!next && next.type === type) { 
      block.appendChild( next.remove() ).unwrap(); 
    }
    // Returns the indentation block instance
    return block;
  }

  public outdent(type: wmIndentType): EditableContent {
    // Skips on invalid nodes
    if(this.removed) { return this; }
    // Performs unindentation when the parent node match the requested type
    if(this.parent.type === type) {
      // Helper function to group sibling nodes
      const groupSiblings = (from: number, to?: number) => {
        // Forces to proceed till the end
        if(to === undefined) { to = this.parent.count; }
        // Wraps the first sibling within the same parent indentation node
        const block = this.parent.childAt(from++).wrap(this.parent.type);
        // Relocates the following siblings from the parent to the nested indentation node
        if(to > from) { block.splice(1, 0, ...this.parent.splice(from, to - from) ); }
      }
      // Groups the preceding siblings
      if(this.index > 0) { groupSiblings(0, this.index); }
      // Groups the following siblings
      if(this.index < this.parent.count - 1) { groupSiblings(this.index + 1); }
      // Unwrap the parent indentation node and we are done
      return this.parent.unwrap(), this; 
    }
    // Climbs up to the next level
    return this.parent.outdent(type);
  }
}