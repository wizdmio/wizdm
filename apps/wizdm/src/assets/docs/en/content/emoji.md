<!-- toc: reference.json -->

# Emoji Support

[Go to the API Reference](docs/emoji#api-reference)

Universal emoji support for Angular. The package provides utilities and components rendering emoji as images whenever the native support were missing.

&nbsp;

# API Reference
[EmojiModule](docs/emoji#emojimodule)

&nbsp;   

## EmojiModule 

```typescript
import { EmojiSupportModule } from '@wizdm/emoji';
```

Import the *EmojiSupportModule* in your app to enable universal emoji support. Use the static `init()` function to setup the module according to your needs.  
```typescript
@NgModule({
  providers: [ EmojiUtils ]
})
export class EmojiSupportModule { 

   static init(config: EmojiConfig): ModuleWithProviders<EmojiSupportModule>;
}
```

### Methods

---

```typescript
static init(config?: EmojiConfig): ModuleWithProviders<EmojiSupportModule>
```
Static module initialization function to customize the module behavior. It returns the customized module instance. 
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

---

&nbsp;  
