
export class DocumentRange {

  constructor(private from: number, private to: number) { }

  public get isCollapsed(): boolean {
    return this.from === this.to;
  }

  public get span(): number {
    return this.from - this.to;
  }

  public collapse() {
    this.from = this.to;
  }

  public get(): [number, number] {
    return [this.from, this.to];
  }

  public set(from: number, to: number) {
 
    // Don't allow values less then 0
    from = Math.max(0, from);
    to = Math.max(0, to);

    // Ensure the values are set in the correct order from (smallest) to (largest)
    this.from = Math.min(from, to);
    this.to = Math.max(from, to);
  }

  // Return true if the specified range is equal to this range
  public eq(range: DocumentRange): boolean {    
    return this.from === range.get()[0] && this.to === range.get()[1];
  }
}


// A list of names for inline nodes (must be specified as lowercase)
const SELF_CLOSING_NODE_NAMES = ['br', 'img', 'input'];

// Return true if nodeA is contained in nodeB
function containedBy(nodeA: Node, nodeB: Node) {
    
  while (!!nodeA) {
    if (nodeA === nodeB) {
        return true;
    }
    nodeA = nodeA.parentNode;
  }
  return false;
}

/**  
  * Given a parent node and offset (in characters), find and return the child
  * node the parent offset falls within, and the offset relative to that
  * child. The child node does not have to be a direct descendant.
  * If a parentNode with no child nodes is passed to the function then it
  * returns the arguments passed in (as there are no children to search).
  */
function getChildNodeAndOffset(parentNode: Node, parentOffset: number) {
    
  if (parentNode.childNodes.length == 0) {
    return [parentNode, parentOffset];
  }

  // We use a stack structure to parse the tree structure of the parent node
  let childNode: Node = null;
  let childOffset = parentOffset;
  let childStack  = Array.from<Node>(parentNode.childNodes);

  while (childStack.length > 0) {
    
    let childNode = childStack.shift();

    // Process each child node based on the type of node
    switch (childNode.nodeType) {

      // Text nodes
      case Node.TEXT_NODE:

        // Found - stop processing and return
        if (childNode.textContent.length >= childOffset) {
          return [childNode, childOffset];
        }

        // Update the offset to reflect that we've moved passed this node
        childOffset -= childNode.textContent.length;
      
      break;

      // Elements
      case Node.ELEMENT_NODE:

        // Inline block elements count as a single character
        if (childNode.nodeName.toLowerCase() in SELF_CLOSING_NODE_NAMES) {
          if (childOffset == 0) {
            return [childNode, 0];
          }
          else {
            childOffset = Math.max(0, childOffset - 1);
          }
        }
        // For elements that support children we prepend any children to the stack to be processed.
        else {
          if (childNode.childNodes) { 
            childStack.unshift( ...Array.from<Node>(childNode.childNodes) );
          }
        }
      break;
    }
  }
  // If the node/child wasn't found we return the last child node and offset to
  // its end.
  return [childNode, childOffset];
}

// Return the offset of a child node relative to a parent node. The child
// node does not have to be a direct descendant.
function getOffsetOfChildNode(parentNode: Node, childNode: Node) {
    
  // If a parentNode with no child nodes is passed to the function then we return 0.
  if (parentNode.childNodes.length == 0) {
    return 0;
  }

  // We use a stack structure to parse the tree structure of the parent node
  let offset = 0
  let childStack = Array.from<Node>(parentNode.childNodes);

  while (childStack.length > 0) {
  
    let otherChildNode = childStack.shift();

    // If this child node is a match for the specified child node return the current offset.
    if (otherChildNode == childNode) {

      if (otherChildNode.nodeName.toLowerCase() in SELF_CLOSING_NODE_NAMES) {
        return offset + 1;
      }
      return offset;
    }
    
    // Process each child node based on the type of node
    switch (otherChildNode.nodeType) {

      // Text nodes
      case Node.TEXT_NODE:
        offset += otherChildNode.textContent.length;
      break;

      // Elements
      case Node.ELEMENT_NODE:

        // Inline block elements count as a single character
        if (otherChildNode.nodeName.toLowerCase() in SELF_CLOSING_NODE_NAMES) {
          offset += 1;
        }
        // For elements that support children we prepend any children to
        // the stack to be processed.
        else if (otherChildNode.childNodes) {
            childStack.unshift( ...Array.from<Node>(childNode.childNodes) );
        }
      break;
    }
  }               
                
  // If the child node wasn't found an offset pointing to the end of the parent node will be sent.
  return offset;
}

/** Return the start/end nodes and relative offsets for the specified document
 * range. This function accepts a document range (e.g Document.createRange),
 * not a ContentSelect.Range.
 */
function getNodeRange(element: Element, docRange: Range) {
    
  let childNodes = element.childNodes;

  // Clone the document range so we can modify it without affecting the current selection.
  let startRange = docRange.cloneRange();
  startRange.collapse(true);

  let endRange = docRange.cloneRange();
  endRange.collapse(false);

  let startNode = startRange.startContainer;
  let startOffset = startRange.startOffset;
  let endNode = endRange.endContainer;
  let endOffset = endRange.endOffset;

  // HACK: We use comparePoint for FF and Chrome when the start/end nodes are
  // reported as the ancestor element and therefore we need to manually find
  // the actual start/end nodes manually and get the correct offset from it.
  //
  // IE 9+ doesn't seem to handle this the same way, the offset still appears
  // to reported correctly in testing and therefore we don't need to use
  // comparePoint for IE - which by is really useful (and worryingly convienent
  // as IE ranges don't support the method.
  if (!startRange.comparePoint) {
    return [startNode, startOffset, endNode, endOffset];
  }
  
  // Find the starting node and offset
  if (startNode == element) {
    
    startNode = childNodes[childNodes.length - 1];
    startOffset = startNode.textContent.length;
/*
        for (let childNode in childNodes) {

            // Check to see if the child node appears after the first character
            // in the range (this is why we collapse the start range).
            if (startRange.comparePoint(childNode, 0) != 1) {
                continue;
            }
            // If this is the first node then the offset must be 0...
            if i == 0
                startNode = childNode
                startOffset = 0

            // ...otherwise select the previous node and set the start offset to
            // the end of the node.
            else
                startNode = childNodes[i - 1]
                startOffset = childNode.textContent.length

            // If the node is an inline block then set the length to 1
            if startNode.nodeName.toLowerCase in SELF_CLOSING_NODE_NAMES
                startOffset = 1

            break

    // Find the ending node and offset

    // If the document range is collapsed the range starts and finishes at the
    // same point so we don't need to search for the end.
    if docRange.collapsed
        return [startNode, startOffset, startNode, startOffset]

    if endNode == element
        endNode = childNodes[childNodes.length - 1]
        endOffset = endNode.textContent.length

        for childNode, i in childNodes

            // Check to see if the child node appears after the first character
            // in the range (this is why we collapse the start range).
            if endRange.comparePoint(childNode, 0) != 1
                continue

            // If this is the first node select it...
            if i == 0
                endNode = childNode

            // ...otherwise select the previous node
            else
                endNode = childNodes[i - 1]

            endOffset = childNode.textContent.length + 1
*/
  }

  return [startNode, startOffset, endNode, endOffset];
}
