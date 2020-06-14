<!-- toc: docs/reference.json -->

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
[EmojiSupportModule](#emojisupportmodule) - [EmojiImageModule](#emojiimagemodule) - [EmojiTextModule](#emojitextmodule) - [EmojiInputModule](#emojiinputmodule)

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

**Methods**

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
|`segments: emSegment[]`|The array of segments the input text has been splitted into|
|`behavior: 'native'`\|`'web'`|Read-only properties returning the current rendering mode. When in *native* mode, the text is rendered as it is. When in *web* mode the emoji(s) are rendered as `<img/>` elements|
|`@Input() value: string`|The input text for the component to be rendered. The input is aliased `wm-emoji-text`|
|`@Input() mode: 'native'`\|`'web'`\|`'auto'`|Sets the rendering mode. When in *native* mode, the text is rendered as it is. When in *web* mode the emoji(s) are rendered as `<img/>` elements. When in *auto* mode the rendering is automatically selected to *native* mode  whenever a native support for emoji is detected or to *web* mode otherwise. Default mode is *auto*|

&nbsp;

## EmojiInputModule

```typescript
import { EmojiIinputModule } from '@wizdm/emoji/input';
```

### EmojiInput Component 
The `EmojiInputModule` exports the `EmojiInput` component. Use the `<wm-emoji-input>` the same way you'd use a `textarea` control. 

The component implements the [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor) interface supporting the Angular's form API. 

Use the `matEmoji` directive to enable the component working within a [MatFormField](https://material.angular.io/components/form-field/overview) the same way native controls do.

```typescript
@Component({
  selector: 'wm-emoji-input'
})
export class EmojiInput extends EmojiText {

  public get collapsed(): boolean;
  public get focused(): boolean;

  public focus();
  public blur();

  @Input() placeholder: string;
  @Input() value: string;

  @Output() valueChange: EventEmitter<string>;
  
  @Input() disabled: boolean; 
  @Input() required: boolean; 
  @Input() newline: 'none'|'always'|'shift';

  @Input() historyTime: number;
  @Input() historyLimit: number;

  public select(start: number, end?: number): this;
  public insert(key: string): this;
  public backspace(): this;
}
```

|**Properties**|**Description**|
|:--|:--|
|`collapsed: boolean`|**True** whenever the current selection is collapsed into a cursor|
|`focused: boolean`|**True** whenever the control has the input focus|
|`@Input() placeholder: string`|The placeholder text as in a regular input control|
|`@Input() value: string`|The input text value|
|`@Output() valueChange: EventEmitter<string>`|Emits the new input value whenever it changes|
|`@Input() disabled: boolea`|When **true** disables the control|
|`@Input() required: boolean`|When **true** marks the control as required|
|`@Input() newline: 'none'`\|`'always'`\|`'shift'`|Selects the way to handle the *return* key. When *none* no new lines are allowed. This makes the control behave similarly to a native `<input>`. When *always* new lines are allowed making the control behave similarly to a native `<textarea>`. When *shift* new lines are allowed when the *return* key is pressed together with the *shift* key or ignored otherwise|
|`historyTime: number`|History (undo) throttle time in milliseconds. New changes are saved only after *historyTime* has passed since the last saved change. Defaults to *1s*|
|`historyLimit: number`|Lenght of the history buffer prior to start overwriting the oldest records. Defaults to *128*|


**Methods**

---

```typescript
public focus() void;
```
Focuses the control for input.

---

```typescript
public blur() void;
```
Clears the focus.

---

```typescript
public select(start: number, end?: number): this;
```
Selects the given portion of the text.
* `start: number` - the selection start offset
* `end: number` - the selection end offset. Defaults to the *start* value when undefined collapsing the selection.

---

```typescript
public insert(key: string): this;
```
Inserts a new text at the current selection.
* `key: string` - the new text. When empty, the current selection is deleted.

---

```typescript
public backspace(): this;
```
Deletes the character (or the emoji sequence) preceding the current cursor position. If the selection isn't collapsed, deletes the current selection.

---

&nbsp;

## EmojiUtils Service
Utility service providing common tools to the package components and directives.

```typescript
@Injectable()
export class EmojiUtils {

  constructor(readonly native: boolean, readonly regex: RegExp);

  public imageFilePath(emoji: string): string;
  public isEmoji(source: string): boolean;
  public parseEmojiCodes(source: string, callbackfn: (match: string, index: number) => void);
}
```

|**Properties**|**Description**|
|:--|:--|
|`native: boolean`|**True** whenever a native emoji support has been detected|
|`regex: RegExp`|A regular expression to match all the emoji symbols according to the Unicode standard. See [emoji-regex](https://www.npmjs.com/package/emoji-regex)|

**Methods**

---

```typescript
public imageFilePath(emoji: string): string;
```
Returns the full path to load the emoji image file according to the given code points sequence.
* `emoji: string` - the emoji code points sequence.

---

```typescript
public isEmoji(source: string): boolean;
```
Returns **true** when the given input matches an emoji sequence according to the Unicode standard.
* `source: string` - an emoji codepoints sequence

```typescript
public parseEmojiCodes(source: string, callbackfn: (match: string, index: number) => void);
```
Parses a string for occurrences of emoji sequences.
* `source: string` - The inpus text to parse.
* `callbackfn: (match: string, index: number) => void` - a callback function called each time a valid emoji sequence has been detected  

---

->
[Next Topic](docs/toc?go=next) 
->
