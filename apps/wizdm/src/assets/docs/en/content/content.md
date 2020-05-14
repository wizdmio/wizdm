<!-- toc: reference.json -->

# Content 

[Go to the API Reference](docs/content#api-reference)

Runtime content management by the [Angular Router](https://angular.io/api/router/Router). The package provides a set of features for automatically install content resolvers to load content files from assets while routing lazily loaded modules. The content is then accessible within the same module components' template via the `wmContent` structural directive.

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
|`config: ContentConfigurator`|The instance of the [ContentConfigurator](docs/content#contentconfigurator)|
|`language: string`|The currernt language the laoder is loading data for|
|`cache: LoaderCache`|The object caching the data while loading to avoid loading the same content multiple times|

### Methods

---
```typescript
public flush(lang: string): LoaderCache;
```
Empties the cache for the specified language. The `defaultValue` from the global configuration is used when left undefined. 

---
```typescript
public languageAllowed(lang: string): string;
```
Checks whenever the given language locale code exists within the *supportedValues* from the global configuration returning the *defaultValue* if not.
* `lang: string` - the language locate code to check

---
```typescript
public abstract loadFile(path: string, lang: string, name: string): Observable<any>;
```
Defines the file loading function returning an *Observable* resolving to the loaded content.
* `path: string` - the path from which loading the content file
* `lang: string` - the language locale code for which loading the content file
* `name: string` - the file name to load the content from

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
|`http: HttpClient`|Instance of [HttpClient](https://angular.io/api/common/http/HttpClient) service|

### Methods

---
```typescript
public loadFile(path: string, lang: string, name: string): Observable<any>;
```
Loads the requested content returning an *Observable*.
* `path: string` - the path from which loading the content file
* `lang: string` - the language locale code for which loading the content file
* `name: string` - the file name to load the content from. Optionally, `name` can specify an extension among: `md`, `txt`, `json`. The extension defaults to `json` when unspecified

---
&nbsp; 

## ContentConfigurator

The content configurator is a singleton service managing the configuration parameters of the package.

```typescript

export interface ContentConfig {
  selector?: string;
  source?: string;
  defaultValue?: string;
  supportedValues?: string[];
}

@Injectable()
export class ContentConfigurator implements ContentConfig {

  public currentValue: string;

  constructor(readonly config: ContentConfig);

  public get selector(): string;
  public get source(): string; 
  public get defaultValue(): string;
  public get supportedValues(): string[];
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
