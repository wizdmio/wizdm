# Emoji Support
Universal emoji support for Angular. The package provides utilities and components rendering emoji as images whenever the native support were missing.

## Installation
Import the *EmojiSupport* module in your root module calling the static `init()` function to setup the source path for the image files:
```typescript
import { EmojiSupportModule } from '@wizdm/emoji';

@NgModule({
  imports: [
    ...
    EmojiSupportModule.init( { 
      emojiPath: "https://cdn.jsdelivr.net/npm/emoji-datasource-google@5.0.1/img/google/64/" 
    })
  ]
  bootstrap: [AppComponent]
})
export class AppModule { }
```
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
