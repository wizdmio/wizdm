
import { wmEditable } from './editable-types';
export * from './editable-types';

/**
 * Implements a common api interface to manipulate the content tree
 */
export class EditableContent {

  // Gets a tree node and updates the children to build the tree during rendering
  public updateTree(root: wmEditable): wmEditable[] {

    if(!!root && !!root.children) {

      // Filters the nodes marked for removal and maps the others
      return root.children.filter( node => !node.remove ).map( (node, i) => {

        // Links the node to its parent
        node.parent = root;
        
        // Tracks the node index
        node.index = i;

        // Computes the node depth
        node.depth = root.depth || 0 + 1;

        // Computes the node ID chaining indexes
        node.name = !!root.name ? `${root.name}.${i}` : i.toString();
        //node.name = `${root.name || 0}.${i}`;
        
        return node;
      });
    }
    return [];
  }

  public nodeName(pos: number[]): string {

    return !!pos ? pos.join('.') : '';
  }

  public fromElement(el: HTMLElement): string {
    return !!el && !!el.id ? el.id.substring(1) : '';
  }

  public elementId(node: wmEditable | string): string {

    const name = typeof node === 'string' ? node : node.name;
    return !!name ? 'N' + name : undefined;
  }

  public nodePosition(name: string): number[] {
  
    return !!name ? name.split('.').map( n => +n ) : [];
  }

  public walkTree(root: wmEditable, name: string): wmEditable {

    const pos = this.nodePosition(name);
    return this._walkTree(root, pos);
  }

  private _walkTree(root: wmEditable, pos: number[]): wmEditable {

    if(pos.length <= 0 || !root || !root.children) {
      return root;
    }

    return this._walkTree(root.children[pos.shift()], pos);
  }

  private lastChild(node: wmEditable) {

    if(!node) { return null; }

    if(!node.children || node.children.length === 0) { return node; }

    return this.lastChild(node.children[node.children.length-1]);
  }
  
  public prevNode(node: wmEditable) {

    const parent = !!node && node.parent;

    if(!parent) { return null; }

    if(node.index > 0) {
      return this.lastChild(parent.children[node.index-1]);
    }

    return this.prevNode(parent);
  }

  public prevText(node: wmEditable) {

    const prev = this.prevNode(node);

    if(!prev) { return null; }

    return (prev.type === 'text') ? prev : this.prevText(prev);
  }

  public removeNode(node: wmEditable) {

    if(!!node) { node.remove = true; }
  }

  public isNodeEmpty(node: wmEditable) {
    
    if(!node) { return true; }

    if(node.type === 'text' && !node.remove && !!node.value && node.value.length > 0) { return false; }

    if(!node.children || node.children.length <= 0) { return true;}

    return node.children.findIndex( node => !this.isNodeEmpty(node) ) < 0;
  }

  public pruneBranch(node: wmEditable) {

    if(this.isNodeEmpty(node)) { 

      node.remove = true;

      if(this.isNodeEmpty(node.parent)) {
        this.pruneBranch(node.parent);
      }
    }
  }

  public isPlainText(node: wmEditable) {
    return !!node && node.type === 'text' && 
    !!node.parent && node.parent.type !== 'emphasis' && 
    node.parent.type !== 'strong' && 
    node.parent.type !== 'delete' &&
    node.parent.type !== 'link' && 
    node.parent.type !== 'sub' &&  
    node.parent.type !== 'sup' && 
    node.parent.type !== 'underline';
  }

  public insertBreak(root: wmEditable, name: string, ofs: number) {

    const from = this.walkTree(root, name);
    const pos = this.nodePosition(name);
    let n = pos.pop();
    
    from.parent.children.splice(++n, 0, {
      type: 'break'
    } as wmEditable);

    from.parent.children.splice(++n, 0, {
      type: from.type,
      align: from.align,
      value: from.value.substring(ofs)
    } as wmEditable);

    from.value = from.value.substring(0, ofs);
  
    pos.push(n);

    return this.nodeName(pos);
  }

  // Turns the content tree into an unformatted string
  public stringify(content: any[]): string {

    if(!content || content.length <= 0) { return ''; }

    return content.reduce( (txt: string, node: any) => {

      txt += node.type === 'text' ? node.value : (node.type === 'break' ? ' ' : '');
      txt += this.stringify(node.children);
      return txt;

    }, '');
  }
}