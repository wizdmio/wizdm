<!-- toc: reference.json -->

# Universal Emoji Support

[Go to the API Reference](docs/emoji#api-reference)

Runtime content management by the [Angular Router](https://angular.io/api/router/Router). The package provides a set of features for automatically install content resolvers to load content files from assets while routing lazily loaded modules. The content is then accessible within the same module components' template via the `wmContent` structural directive.

&nbsp;

# API Reference
[EmojiModule](docs/emoji#emojimodule)

&nbsp;   

## EmojiModule 

```typescript
import { EmojiSupportModule } from '@wizdm/emoji';
```

The main module provides an optional `init()` static function to customize the module behvior:
```typescript
static init(config?: EmojiConfig): ModuleWithProviders<EmojiSupportModule>
```
* `config: EmojiConfig` - the configuration object.
```typescript
export interface EmojiConfig {

  emojiPath?: string;  
  emojiExt?: string;
};
```
|**Value**|**Description**|
|:--|:--|
|`emojiPath: string`||
|`emojiExt: string`||
&nbsp;  
