@wizdm/prism
============

Code syntax highlighting for Angular powered by [Prism](https://prismjs.com). The package rely on *PrismJS* to tokenize the input string accodring to the selected language while the redering is performed with regular Angular's directives.

## Installation
Use `npm` to install the @wizdm/prism module together with the official [prismjs](https://prismjs.com/) module:

```
npm install @wizdm/prism prismjs
```

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

When disabled the highlighter renders its translcluded content giving the user the ability to decide how to better handle the outcome. The example above shows how to revert to a plain code without highlighting.

## Languages
[Prismjs](https://prismjs.com/) comes with few languages already included: `markup` (aka `html`), `css`, `c-like` and `js`.
Additional languages such as `typescript` or `scss` can be included both statically or dynamically. Here the [full list](https://prismjs.com/#supported-languages).

### Including language statically
Simply import the relevant language module from `prism/components` righ after the main module. Makes sure taking care of the dependencies, if any.

### Including language dynamically
You can instruct `PrismModule` to lazily load the language module on demand by passing a list of language loaders to its static `init()` function:

```typescript

import { PrismModule } from '@wizdm/prism';

...

// Defines the extra language loaders
export const supportedLanguages = [
  { 
    name: 'scss', 
    load: () => import('prismjs/components/prism-scss') 
  },
  { 
    name: ['typescript', 'ts'], 
    load: () => import('prismjs/components/prism-typescript') 
  },
  { 
    name: ['markdown', 'md'], 
    load: () => import('prismjs/components/prism-markdown') 
  }
];

...


@NgModule({
  ...
  imports: [

    // Initialize the extra languages
    PrismModule.init(supportedLanguages),
    ...
  ]
})
export class AppModule();

```

### Universal language loader
In order to support all the available languages at once, a single universal loader can be used as the following:

```typescript

export const supportedLanguages = [
  // Universal loader
  { name: '*', load: (language) => import(`prismjs/components/prism-${language}`) }
];

```

## Theming
Simply import your preferred theme from `prismjs/themes` into your main *style.scss*.