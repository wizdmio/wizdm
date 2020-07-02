<!-- toc: docs/reference.json -->

# Markdown rendering
[Go to the API Reference](#api-reference)

Markdown rendering for Angular powered by [remark](https://github.com/remarkjs/remark). This package rely on *remark* markdown processor to build an [MDAST](https://github.com/syntax-tree/mdast) syntax tree. The [MarkdownRoot](#markdownrootcomponent) component renders its view recursing down the tree using native Angular's directive only.

## Features
The renderer implements all the basic capabilities plus few additions such as alignemnt, subscript and superscript and code syntax highlighting thanks to [@wizdm/prism](./prism). It also supports emoji rendering on all platforms thanks to [@wizdm/emoji](./emoji).  

A guide to all the supported feature si availalble [here](./markdown-features). 

&nbsp;  

# API Reference
[MarkdownModule](#markdownmodule) - [MarkdownRoot](#markdownroot) - [MarkdownBlock](#markdownblock) - [MarkdownInline](#markdowninline) - [MarkdownTree](#markdowntree) 

## MarkdownModule 

```typescript
import { MarkdownModule } from '@wizdm/markdown';
```

Import the MarkdownModule in your desired feature module. Use the static `init()` function to setup the module according to your needs.

```typescript
@NgModule({
  exports: [ MarkdownRoot ]
})
export class MarkdownModule { 

  static init(config?: MarkdownConfig): ModuleWithProviders<MarkdownModule>;
}
```

**Methods**

---

```typescript
static init(config?: MarkdownConfig): ModuleWithProviders<MarkdownModule>;
```
Static module initialization function to customize the module behavior. It returns the customized module instance.
* `config: MarkdownConfig` - the configuration object.
```typescript
export interface MarkdownConfig {
  gfm?        : boolean; // 
  commonmark? : boolean; // 
  footnotes?  : boolean; // Enable footnotes (default: false)
};
}
```
|**Value**|**Description**|
|:--|:--|
|`gfm: boolean`|Github Flowered Markdown mode. Defaults to **true** when undefined|
|`commonmark: boolean`|Enables Commonmark mode. Defaults to **false** when undefined|
|`footnotes: boolean`|Enables footnotes. Defaults to **false** when undefined|

---

&nbsp;  


->
[Next Topic](docs/toc?go=next) 
->
