<!-- toc: docs/reference.json -->

# Syntax Highlighting

[Go to the API Reference](#api-reference)

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

The languages modules are Angular's module wrapping the original `prism/components` taking care of the dependencies, if any.

### Theming
Simply import your preferred theme from `prismjs/themes` into your main *style.scss*.

&nbsp;

# API Reference
[PrismModule](#prismmodule) - [PrismHighlighter](#prismhighlighter) - [PrismTokenizer](#prismtokenizer) 

## PrismModule 

```typescript
import { PrismModule } from '@wizdm/prism';
```

## PrismHighlighter
Syntax highlighter component. The component renders an inner <code> element where the tokenization with highlighting takes place.

```typescript
@Component({
  selector: 'pre[wm-prism]'
})
export class PrismHighlighter { 
  
  @Input('wm-prism') source: string;
  @Input() disabled: boolean;
  @Input() language: string;
}
```
|**Properties**|**Description**|
|:--|:--|
|`@Input() source: string`|The source text code to be highlighted. The input is aliased as `wm-prism`|
|`@Input() disabled: boolean`|When **true** disables the highlighting. The component renders the transcluded content when disabled|
|`@Input() language: string`|The language for which the highlighting is requested. The component renders the plain source text if the requested language is not available|

&nbsp; 

## PrismTokenizer
Code tokenization component. Used by [PrismHighlighter](#prismhighlighter) during rendering. The component can be used alone on any elements other then `<pre>`.

```typescript
@Component({ 
  selector: ':not(pre)[wm-prism]'
}) 
export class PrismTokenizer { 

  @Input('wm-prism') set source(source: TokenStream);
  @Input() set language(language: string);
}

```
|**Properties**|**Description**|
|:--|:--|
|`@Input() source: TokenStream`|The input stream for *PrismJS* to tokenize. The input is aliases as `wm-prism`|
|`@Input() language: string`|The language for whick the tokenization is requested|

---

->
[Next Topic](docs/toc?go=next) 
->
