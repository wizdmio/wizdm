@wizdm/prism
============

Code syntax highlighting for Angular powered by [Prism](https://prismjs.com). The package rely on *PrismJS* to tokenize the input string accodring to the selected language while the redering is performed with regular Angular's directives.

## Usage Example
Simply use `wm-prism` on a `<pre>` element:

```html
  <!-- Renders myCode applying syntax highlighting for 'typescript' --> 
  <pre [wm-prism]="myCode" [disabled]="disabled" language="typescript">
    <!-- This is rendered when disabled -->
    <code>{{ myCode }}</code>
  </pre>
```
The `wm-prism` selector on a `<pre>` element instantiates a [PrismHighlighter](#prismhighlighter) component. When enabled, the component renders an inner `<code>` element to which a [PrismTokenizer](#prismtokenizer) is attached.

When disabled the highlighter renders its translcluded content giving the user the ability to decide how to better handle the outcome.  The example above shows how to revert to a plain code without highlighting.

## Installation
Import the [PrismModule](#prismmodule) in your target feature module. Notes that by *PrismJS* natively supports *Markup*, *CSS*, *C-like* and *JavaScript* languages while more languages can be imported separaterly. 

### Languages
Simply import the relevant language module from `prism/components` righ after the main module. Makes sure taking care of the dependencies, if any.

### Theming
Simply import your preferred theme from `prismjs/themes` into your main *style.scss*.