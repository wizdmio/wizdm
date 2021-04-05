# CORS File Download Helper
@wizdm/download provides a directive enabling direct download of files from servers breaking free from the same-origin policy provided the server supports CORS.

## Installation
Use `npm` to install the @wizdm/download module:

```
npm install @wizdm/download
```

## Usage 
Import the `DownloadModule` in your feature Module to import the `DownloadDirective`.

``` typescript
import { DownloadModule } from '@wizdm/download';
...

@NgModule({
  ...
  imports: [

    DownloadModule,
    ...
  ]
})
export class MyModule();
```

Use the `[download]` directive in an achor element, similarly to the way you'd use the anchor's download property, to enable the direct download:

``` html
<a mat-icon-button
   [href]="sourcePath"
   [download]="fileName"
   title="download {{ fileName }}">
  <mat-icon inline>get_app</mat-icon>
</a>
```
## How It Works
The working mechanism is simple. Whenever the given `href` points to a different origin resource, by clicking on the element the user triggers an http request downloading the file to be inlined replacing the original source path with the resulting encoded blob.
