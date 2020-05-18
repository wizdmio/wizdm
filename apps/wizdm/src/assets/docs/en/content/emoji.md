<!-- toc: reference.json -->

# Emoji Support

[Go to the API Reference](#api-reference)

Universal emoji support for Angular. The package provides utilities and components rendering emoji as images whenever the native support were missing. 

The package is designed to work with images following [emoji-datasource](https://www.npmjs.com/package/emoji-datasource) naming convention.

## Usage Example
The package can be used to both render text or to capture input with emoji:

```html
  <!-- Displays a text with emoji --> 
  <h1 wm-emoji-text="Send a message 😉"></h1>
  
  ...
  
  <!-- Emoji Input within a Material Form -->
  <mat-form-field>
    <mat-label>Emoji Input</mat-label>
    <wm-emoji-input matEmoji [(formControl)]="text" name="text"></wm-emoji-input>
    <mat-hint>Material Form Field applied to universal Emoji Input</mat-hint>
  </mat-form-field>
  
  ...
  
```

Use the `<wm-emoji-text>` component to render texts. If native support is available, the component simply renders the text as it is. In case of native support missing, the component renders the text using `<img/>` elements to render the emoji. 

Use the `<wm-emoji-input>` the same way you'd use a `textarea` control. The component implements the [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor) interface supporting the Angular's form API. 

Use the `matEmoji` directive to enable the component working within a [MatFormField](https://material.angular.io/components/form-field/overview).

&nbsp;

# API Reference
[EmojiSupportModule](#emojisupportmodule), [EmojiImageModule](#emojiimagemodule) - [EmojiTextModule](#emojitextmodule)

&nbsp;   

## EmojiSupportModule 

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
|`emojiPath: string`|Path to load the emoji images from|
|`emojiExt: string`|Image file extension. Defaults to `PNG` when left undefined|

The package is designed to work with images following [emoji-datasource](https://www.npmjs.com/package/emoji-datasource) naming convention.

---

&nbsp;  

## EmojiImageModule

```typescript
import { EmojiImageModule } from '@wizdm/emoji/image';
```

### EmojiImage Directive
The `EmojiImageModule` exports the `EmojiImage` directive taking care of loading the most appropriate image to render the given emoji. 

```typescript
@Directive({
  selector: 'img[wm-emoji]'
})
export class EmojiImage {

  public error: boolean; 
  public load: boolean; 
  public emoji: string;
  
  get loading(): boolean;

  @Input('wm-emoji') set value(emoji: string);
  
  @Input() size: string;
  @Input() spacing: string;

  @Output() hit: EventEmitter<'left'|'right'>;
}
```

|**Properties**|**Description**|
|:--|:--|
|`error: boolean`|**True** whenever there was an error while loading the image|
|`load: boolean`|**True** when the image has been load. **False** while loading|
|`loading: boolean`|**True** while loading the image|
|`emoji: string`|The requested emoji sequence| 
|`@Input() value: string`|Sets the requested emoji triggering the image loading. This input is aliased as `wm-emoji`|
|`@Input() size: string`|Customizes the size for the emoji. Defaults to *1.25em* when left undefined|
|`@Input() spacing: string`|Customizes the spacing, applying both a left and right margin. Defaults to *0.05em* when undefined |
|`@Output() hit: EventEmitter<'left'`\|`'right'>`|Emits when the image is clicked. The emitted value depends on which side the image has been clicked on|

&nbsp;

## EmojiTextModule

```typescript
import { EmojiTextModule } from '@wizdm/emoji/text';
```

### EmojiText Component
The `EmojiTextModule` exports the `EmojiText` component suitable to render a text containing emoji(s). If native support is available, the component simply renders the text as it is. In case of native support missing, the component uses [EmojiImage directive](#emojiimagedirective) to render the emoji as images. 

```typescript

export interface emSegment {
  type: 'text'|'emoji';
  content: string;
}

@Component({
  selector: '[wm-emoji-text]'
})
export class EmojiText {

  constructor(readonly utils: EmojiUtils);
  
  readonly segments: emSegment[];
  
  get behavior(): 'native'|'web';

  @Input('wm-emoji-text') value: string;
    
  @Input() mode: 'auto'|'native'|'web';
}
```

|**Properties**|**Description**|
|:--|:--|
|`utils: EmojiUtils`|The [EmojiUtils](#emojiutils) service instance|
|`segments: emSegment[]`||
|``||
|``||
|``||
