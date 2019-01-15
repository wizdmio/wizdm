import { wmEditable, wmNodeType, wmInlineType, wmBlockType, wmAlignType } from './editable-types';
export * from './editable-types';

export class EditableContent<T extends wmEditable = wmEditable> {

  private node: T;
  private name: string;
  private parent: EditableContent;
  private children: EditableContent[] = [];
  private index: number = -1; 
  private depth: number = 0;

  constructor(data: T) { 
    this.node = data;
  }

  get data(): T { return this.node as T; }
  
  get type(): wmNodeType { return !!this.node ? this.node.type : undefined; }

  get hasChildren(): boolean { return !!this.node && !!this.node.children && this.node.children.length > 0; }

  get text() { return this.type === 'text';}
  get bold() { return this.descendantOf('bold');}
  get italic() { return this.descendantOf('italic');}
  get strikethrough() { return this.descendantOf('delete');}
  get underline() { return this.descendantOf('underline');}
  get link() { return this.descendantOf('link');}
  get subScript() { return this.descendantOf('sub');}  
  get superScript() { return this.descendantOf('sup');}

  get align(): wmAlignType { return !!this.node ? this.node.align : undefined; }  
  
  get value(): string { return !!this.node ? this.node.value : ''; }
  set value(text: string) { if(this.text) { this.node.value = text;}}
  get length() { return this.text ? this.value.length : -1; }

  get id(): string { return !!this.name ? 'N'+this.name : undefined; }
  get content(): EditableContent[] { return this.children; }
  get count(): number { return this.content.length; }

  get empty(): boolean {
    // If node has just been removed
    if(!this.type) { return true; }
    // If node has a text content
    if(this.length > 0) { return false; }
    // If node has no children
    if(this.count <= 0) { return true; }
    // If all childrean are empty
    return this.content.every( node => node.empty ); 
  }
  
  //get emptish(): boolean { return this.empty || this.value.search(/[^\s]/) < 0; }
  //get dead(): boolean { return this.empty && this.count <= 0; }

  append(text: string): string {
    return this.value += text;
  }

  tip(till: number): string {
    return !!till ? this.value.slice(0, till) : '';
  }

  tail(from: number): string {
    return !!from ? this.value.slice(from) : '';
  }

  insert(text: string, at?: number): string {
    return !at ? this.append(text) : (this.value = this.tip(at) + text + this.tail(at));
  }

  extract(from: number, to?: number): string {
    const ret = this.value.slice(from, to);
    this.value = this.tip(from) + this.tail(to);
    return ret;
  }

  cut(till: number, from?: number): string {
    return this.value = this.extract(till, from);
  }

  clear(): EditableContent {
    this.value = '';
    return this;
  }

  // Turns the content tree into an unformatted string
  public stringify(): string {

    return this.content.reduce( (txt: string, node: EditableContent) => {

      txt += node.text ? node.value : (node.type === 'break' ? ' ' : '');
      txt += node.stringify();
      return txt;

    }, '');
  }

  private element: HTMLElement;
  private modified: boolean;

  public render(el: HTMLElement): string {
    
    this.element = el;
    return this.value || '\u200B';
  }

  public sync(): string {

    if(!!this.element) {

      const text = this.element.innerText;
      this.modified = text !== this.value;
      this.value = text;
    }

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

  private format(): EditableContent {

    if(!this.hasChildren) {
      switch(this.type) {
        
        case 'bold': case'italic': case 'underline': case 'delete': case 'link': case 'sub': case 'sup':
        case 'paragraph': case 'blockquote':

        this.appendChild(this.createText(''));

        default:
      }
    }

    return this;
  }

  /** Updates (aka create) the node children based on the source tree 
   * @param defer (optiona) when true, it doesnt propagate the creation
   * down to further descendants
  */
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
          // Ensure the node is properly formatted
          //child.format();
          // Recurs along further descendants when not deferred
          return defer ? child : child.update();
      });
    }

    return this;
  }

  /** Marks the node type as undefined so it'll disappear during the next update round */
  public remove(): EditableContent {
    
    if(!this.node) { return null; } 
    this.node.type = undefined;
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
    if(!node) { return undefined; }
    if(this.name < node.name) { return -1; }
    if(this.name > node.name) { return +1; }
    return 0;
  }

  /** Walks back the tree branch to check whenever an ancestor's type is among the specified ones */
  private containedIn(matchTypes: wmNodeType[], node: EditableContent = this): boolean {

    if(!node) { return false; }
    return matchTypes.some( d => d === node.type ) || this.containedIn(matchTypes, node.parent);
  }

  /** Checks if the node descends from the specified type */
  public descendantOf(type: wmNodeType): boolean {
    return this.containedIn([type]);//!!this.wraps && !!this.wraps[type];
  }

  /** Returns an array of all the ancestors' types up to the root */
  public ancestors(node: EditableContent = this): wmNodeType[] {
    
    if(!node || !node.parent) return [];
    // Walks up toward the root
    const ancestors = this.ancestors(this.parent);
    // Append the parent type 
    ancestors.push(this.parent.type);
    return ancestors;
  }

  public ancestor(depth: number) {

    if(!this.parent || this.depth <= depth) { return null; }

    return this.parent.depth > depth ? 
      this.parent.ancestor(depth):
        this.parent;
  }

  public block(): wmBlockType {
    const block = this.ancestor(1);
    return !!block ? block.type : undefined;
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
   */
  private insertAt(at: number, node: EditableContent) {

    if(at > this.count) { return null; }
    // Adds the node shifting the others
    this.content.splice(at, 0, node.inherit(this, at));
    // Refreshes the shifted children (including the inserted one)
    this.refresh(at);
    
    return node;
  }

  /** Checks if the requested node is among this children */
  public childOfMine(node: EditableContent): boolean {
    return node.index < this.count && this.content[node.index] === node;
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
    return this.childOfMine(before) ? this.insertAt(before.index, node) : null;
  }

  /**
   * Inserts a node after the specified one
   * @param after the child node after wich to insert the new child
   * @param node the new child node to be inserted
   * @return the new inserted node or null in case after was not a child of this
   */
  public insertAfter(after: EditableContent, node: EditableContent): EditableContent {  
    return this.childOfMine(after) ? this.insertAt(after.index + 1, node) : null;
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

  /** Jumps to the previous node diving down to leaves */
  public previousNode(): EditableContent {
    return this.stepBackward();
  }

  /** Jumps to the next node diving down to leaves */
  public nextNode(): EditableContent {
    return this.stepForward();
  }

  /** 
   * Jumps to the previous text node
   * @param level the max depth up to the tree will be traversed while searching 
   */
  public previousText(level: number = 1): EditableContent {

    const prev = this.stepBackward(level);
    return !prev || prev.text ? prev : prev.previousText(level);
  }

  /** 
   * Jumps to the next text node
   * @param level the max depth up to the tree will be traversed while searching 
   */
  public nextText(level: number = 1): EditableContent {

    const next = this.stepForward(level);
    return !next || next.text ? next : next.nextText(level);
  }

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

  /** Walks up the tree branch removing all the empty nodes */
  public prune(depth: number = 0) {
    // When node is empty
    if(this.depth > depth && this.empty) {
      // Mark this node for removal
      this.remove();
      // Climbs the parent up to prune it when empty
      return !!this.parent ? this.parent.prune() : null;
    }
    return this;
  }

  /** 
   * Merges the two nodes by type 
   * @param node the node to be merged with
  */
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
      // Merges the node by type
      if(node.type === next.type) {
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
  }

  /**
   * Wraps a given node in a new one of the specified type
   * @param type the wrapper node type
   * @return the new wrapping node 
   */
  public wrap(type: wmNodeType): EditableContent {
    // Skips whenever the node is already wrapped within the same type 
    if(this.descendantOf(type)) { return null; }
    // Creates a new node of the requested type
    const wrap = this.createNode(type);
    // Replaces this node with the new wrapper at the original parent
    if(!!this.parent) {
      this.parent.replaceChild(this, wrap)
    }
    // Appends this node to be the child of the new wrappes instead
    wrap.appendChild(this);
    return wrap;
  } 

  /**
   * Unwaprs this node from the ancestor of the specified type
   * @param type the type of ancestor to be unwrapped from
   * @return the unwrapped node
   */
  public unwrap(type: wmNodeType) {
    // Skips wheneve the node was not wrapped by the specified type
    if(!this.descendantOf(type)) { return null; }
    return this._unwrap(this, type);
  }

  private _unwrap(node: EditableContent, type: wmNodeType) {

    if(!node || !node.parent) { return null; }
    // When the node parent type matches the requested...
    if(node.parent.type === type) {

      if(!node.parent.parent) { return null; }
      // Replaces the node
      node.parent.parent.replaceChild(node.parent, node);
      // Deletes the wrapper
      delete node.parent;
      return node;
    }
    // Recurs up till the specified type is found
    return this._unwrap(node.parent, type);
  }
}
