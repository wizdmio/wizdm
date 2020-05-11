<!-- toc: reference.json -->

# Content 

[Go to the API Reference](docs/content#api-reference)

Content is loaded at runtime by the [Router](https://angular.io/api/router/Router). `@wizdm/content` package provides a set of features for automatically install content resolvers to load content files from assets while routing lazily loaded modules. The content is then accessible within the same module components' template via the `wmContent` structural directive.

## Usage example
Use the `wmContent` structural directive to select the relevant content within the template: 

```html
<!-- Use wmContent to select the relevant data -->
<ng-container *wmContent="let msgs select 'home'"> 

  <h1>{{ msgs.title || 'Get your app done right' }}</h1>

  <p>{{ msgs.body || 'Wizdm provides all the key features of a modern single page application ready to use' }}</p>
  
  <button mat-raised-button color="accent" [routerLink]="msgs.action?.link">{{ msgs.action?.caption || 'Get started' }}</button>

</ng-container>
```

---

Includes the `content` in the routes using the `ContentRouterModule` in place of the regular `RouterModule` in the lazy loaded child modules:

```typescript
// HomeModule.ts
...
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'home',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    ...,
    ContentRouterModule.forChild(routes)
  ]
})
export class HomeModule { }
```

## Multiple Languages

The package is designed to provide runtime content in multiple languages selecting the proper language by means of a route parameter placed at the very root of the url like "https\://mycooldomain.io/**en**/home” for English and “https\://mycooldomain.io/**it**/home” for italian. 

To achieve it, the package assumes the app complies with the following pattern:

->
![Routing Diagram](assets/docs/images/routing-diagram.png#80)
<-

The AppComponent template contains the first `<router-outlet>` where the *Router* will load a *NavigatorComponent*. 
The routing path of the *NavigatorComponent* is the `:lang` token, so, the *Router* will store the language code within a parameter (named *lang*) in the activated route. 
The *NavigatorComponent* template contains the second `<router-outlet>` where the router will load the actual pages, so, both the navigator and the pages we’ll have the opportunity to dynamically load their content based on the language code. 

## Content Loading
The requested content is loaded by means of [resolvers](https://angular.io/guide/router#resolvers) during routing. Which content to load is specified in the [RoutesWithContent]() array of each routed feature module. The proper resolvers are created at run-time while lazily loading the module.

&nbsp; 

# API Reference
[ContentModule](docs/content#contentmodule) - [ContentDirective](docs/content#contentdirective) - [ContentLoader](docs/content#contentloader) - [FileLoader](docs/content#fileloader) - [ContentConfigurator](docs/content#contentconfigurator) - [SelectorResolver](docs/content#selectorresolver) - [ContentSelector](docs/content#contentselector) - [ContentResolver](docs/content#contentresolver) - [ContentRouterModule](docs/content#contentroutermodule)

&nbsp;   

## ContentModule 

```typescript
import { ContentModule } from '@wizdm/content';
```

The main module provides an optional `init()` static function to customize the module behvior:
```typescript
static init(config?: ContentConfig): ModuleWithProviders<ContentModule>
```
**config**
```typescript
export interface ContentConfig {
  selector?: string;
  source?: string;
  defaultValue?: string;
  supportedValues?: string[];
}
```
|**Value**|**Description**|
|:--|:--|
|`selector: string`|The route parameter used to catch the language. Defaults to *lang* when unspecified|
|`source: string`|The path from wich the loader will load the content files. Defaults to *assets/i18n* when unspecified|
|`defaultValue: string`|The defaultl selector value to be used when none is provided by the current route. Defaults to *en* when unspecified|
|`supportedValues: string[]`|An array of possible selector values to accept as valid. Any selector value not matching a suported one will be automatically reverted to the `defaultValue`|

&nbsp;  

## ContentDirective
The `wmContent` directive selects the loaded content providing it to the template under the requested name. The syntax is similar to `*ngIf`: 

->
`*wmContent="let msgs select 'home'"`
<-

selects the property `home` from the resolved content data making it available within the template as `msgs`. 

```typescript
@Directive({
  selector: '[wmContent]',
  providers: [ ContentStreamer ]
})
export class ContentDirective {

  public $implicit: any;
  public get language(): string;

  @Input() wmContentOr: any;
  @Input() set wmContentSelect(selector: string);
  @Input() set wmContentStream(selector: string);
}
```

|**Properties**|**Description**|
|:--|:--|
|`$implicit: any`|The `$implicit` variable provided within the context ov the child view|
|`language: string`|Read-only value returning the currently loaded language|
|`@Input() wmContentSelect: string`|Name of the property to select the content from fo be resolved as an Object| 
|`@Input() wmContentStream: string`|Name of the property to select the content from to be returned as an Observable|
|`@Input() wmContentOr: any`|Default value to return in case the requested selection isn't defined| 

&nbsp;  

## ContentStreamer
The service, provided within the ContentDirective, extracting the resolved data from the [ActivatedRoute](https://angular.io/api/router/ActivatedRoute).

```typescript
@Injectable()
export class ContentStreamer {

  constructor(readonly route: ActivatedRoute, readonly config: ContentConfigurator) {}
  
  get data(): any;
  get data$(): Observable<any>;

  get language(): string;
  get language$(): Observable<string>;

  public select(selector: string, data: any): any;
  public stream(selector: string): Observable<any>;
}
```

|**Properties**|**Description**|
|:--|:--|
|`route: ActivatedRoute`|The activated route the service is going to exrtact the data from. Make sure the service is provided within the target component for the ActivateRoute to be the correct one|
|`config: ContentConfigurator`|The content configurator service|
|`data: any`|The data payload extracted from the activated route snapshot|
|`data$: Observable<any>`|An observable resolving to the data payload from the activated route|
|`language: string`|The current language locale as from the route snapshot|
|`language$: Obseravble<string>`|An observable resolving to the current language locale resolving form the route| 

### Methods 

---

```typescript
public select(selector: string, data?: any): any;
```

Extracts the requested content from the routing data.
* `selector: string` - The path to the property to extract the data from. Use the dot syntax (*'root.child.child'*) to dig several levels deep.
* `data?: any` - Optional object to extract the requested data from. Defaults to the data coming from the activated route when left undefined.

---

```typescript
public stream(selector: string): Observable<any>;
```

Returns an observable extracting the requested content from the routing data.
* `selector: string` - The path to the property to extract the data from. Use the dot syntax (*'root.child.child'*) to dig several levels deep.

---

&nbsp; 

## ContentLoader
The abstract class defining the content loading interface.

```typescript

export interface LoaderCache {
  [key:string]: string;
  lang: string;
}

export abstract class ContentLoader {

  constructor(readonly config: ContentConfigurator);

  public get cache(): LoaderCache;
  public get language(): string;

  public flush(lang: string): LoaderCache;

  public languageAllowed(lang: string): string;
  public abstract loadFile(path: string, lang: string, name: string): Observable<any>;
}
```

|**Properties**|**Description**|
|:--|:--|
|``||
|``||

### Methods

---

```typescript
```

---

&nbsp; 

## FileLoader

```typescript
@Injectable()
export class FileLoader extends ContentLoader {

  constructor(readonly http: HttpClient);

  public loadFile(path: string, lang: string, name: string): Observable<any>;
}
```

|**Properties**|**Description**|
|:--|:--|
|``||
|``||

### Methods

---

```typescript
```


## ContentConfigurator

```typescript
```

|**Properties**|**Description**|
|:--|:--|
|``||
|``||

### Methods

---

```typescript
```


## SelectorResolver

```typescript
```

|**Properties**|**Description**|
|:--|:--|
|``||
|``||

### Methods

---

```typescript
```

## ContentSelector

```typescript
```

|**Properties**|**Description**|
|:--|:--|
|``||
|``||

### Methods

---

```typescript
```

## ContentResolver

```typescript
```

|**Properties**|**Description**|
|:--|:--|
|``||
|``||

### Methods

---

```typescript
```

## ContentRouterModule

```typescript
```

|**Properties**|**Description**|
|:--|:--|
|``||
|``||

### Methods

---

```typescript
```

---
->
[Next Topic](docs/toc?go=next) 
->
