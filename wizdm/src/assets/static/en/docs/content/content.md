<!-- toc: docs/reference.json -->

# Dynamic Content 

[Go to the API Reference](#api-reference)

Runtime content management by the [Angular Router](https://angular.io/api/router/Router). The package provides a set of features for automatically install content resolvers to load content files from assets while routing lazily loaded modules. The content is then accessible within the same module components' template via the `wmContent` structural directive.

&nbsp;

# API Reference
[ContentModule](#contentmodule) - [ContentDirective](#contentdirective) - [ContentLoader](#contentloader) - [FileLoader](#fileloader) - [ContentConfigurator](#contentconfigurator) - [SelectorResolver](#selectorresolver) - [ContentSelector](#contentselector) - [ContentResolver](#contentresolver) - [ContentRouterModule](#contentroutermodule)

&nbsp;   

## ContentModule 

```typescript
import { ContentModule } from '@wizdm/content';
```

Import the ContentModule in your root app module to enable content resolving. Use the static `init()` function to setup the module according to your needs.

```typescript
@NgModule({
  exports: [ ContentDirective ]
})
export class ContentModule { 
  
  static init(config: ContentConfig): ModuleWithProviders<ContentModule>;
}
```

**Methods**

---

```typescript
static init(config?: ContentConfig): ModuleWithProviders<ContentModule>
```
Static module initialization function to customize the module behavior. It returns the customized module instance.
* `config: ContentConfig` - the configuration object.
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

---
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

---
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

&nbsp;

**Methods**

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
|`config: ContentConfigurator`|The instance of the [ContentConfigurator](#contentconfigurator)|
|`language: string`|The currernt language the laoder is loading data for|
|`cache: LoaderCache`|The object caching the data while loading to avoid loading the same content multiple times|

&nbsp;

**Methods**

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
* `lang: string` - the language locale code to check

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

&nbsp;

**Methods**

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
|`currentValue: string`|The currently selected language value stored within the configurator to be shared across services|
|`selector: string`|The route selector (aka param name) as per the config object|
|`source: string`|The source path of the content json files as per the config object|
|`defaultValue: string`|The default language code as per the config object|
|`supportedValues: string[]`|The array of suported language codes as per the config object|

---
&nbsp; 

## SelectorResolver
Default language code resolver. The language code is expected to be a *:lang* token of the root route first child.
E.g. https\://whatever.io/:lang/home where *:lang* is a two digit country code: 'en', 'it', 'ru', ... 
 
```typescript
@Injectable()
 export class SelectorResolver implements Resolve<string> {

  constructor(readonly config: ContentConfigurator);

  public resolve(route: ActivatedRouteSnapshot): string;
}
```

|**Properties**|**Description**|
|:--|:--|
|`config: ConfigResolver`|The common [ContentConfigurator](#contentconfigurator) instance|

&nbsp;

**Methods**

---

```typescript
public resolve(route: ActivatedRouteSnapshot): string;
```

The resolving method, as per the [Resolve](https://angular.io/api/router/Resolve) interface, returning the requested language locale code detected from the route.

---
&nbsp; 

## ContentSelector
The router guard in charge of selecting the content language to load according to the requested locale from the route. It implements the [CanActivate](https://angular.io/api/router/CanActivate) interface.

```typescript
export type AllowedContent = Observable<true|UrlTree>|Promise<true|UrlTree>|true|UrlTree;

@Injectable()
export class ContentSelector implements CanActivate {

  constructor(readonly router: Router, readonly config: ContentConfigurator);

  public get browserLanguage(): string;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AllowedContent;
  
  public requestedValue(route: ActivatedRouteSnapshot): string;
  public isValueAllowed(value: string): boolean;
  public valueAllowed(value: string): string;
}
```

|**Properties**|**Description**|
|:--|:--|
|`router: Router`|The [Router](https://angular.io/api/router/Router) instance|
|`config: ContentConfigurator`|The common [ContentConfigurator](#contentconfigurator) instance|
|`browserLanguage: string`|Returns the language locale code detected from the browser|

&nbsp;

**Methods**

---

```typescript
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AllowedContent;
```
The canActivate method according to the [CanActivate](https://angular.io/api/router/CanActivate) interface. Returns *true* allowing the resolution of the requested content when falling within the supported languages or an UrlTree to redirect the routing. 

---

```typescript
public requestedValue(route: ActivatedRouteSnapshot): string;
```
Extract the requested language locale from the route.
* `route: ActivatedRouteSnapshot` the route snapshot to extract the language locale from

---

```typescript
public isValueAllowed(value: string): boolean;
```
Compares the given language value with the supported ones.
* `value: string` - the language locale to check

Returns *true* whenever the rewuested locale is supported,  *false* otherwise.

---

```typescript
public valueAllowed(value: string): string;
```
Checks whenever the given language locale value is supported returning the *defaultValue* otherwise.
* `value: string` - the language locale code to check

---
&nbsp; 

## ContentResolver
The resolver in charge of loading the content files while routing. It implements the [Resolve](https://angular.io/api/router/Resolve) interface.
```typescript

export class ContentResolver implements Resolve<any> {

  static create<T = any>(source: string, file: string, providedIn: 'root'|Type<T> = 'root'): InjectionToken<ContentResolver>;

  constructor(readonly loader: ContentLoader, readonly selector: SelectorResolver, readonly source: string, readonly file: string) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<any>;
}
```

|**Properties**|**Description**|
|:--|:--|
|`loader: ContentLoader`|The [ContentLoader](#contentloader) instance to load the content while resolving the route|
|`selector: SelectorResolver`|The [SelectorResolver](#selectorresolver) instance to detect the language for which loading the content while resolving th route|
|`source: string`|The source path to load the content file from|
|`file: string`|The name of the content file to load|

&nbsp;

**Methods**

---

```typescript
static create<T = any>(source: string, file: string, providedIn: 'root'|Type<T> = 'root'): InjectionToken<ContentResolver>;
```
Static creation function. Retunrs an injectable content resolver, in the form of an [InjectionToken](https://angular.io/api/core/InjectionToken), to load the specified file.
* `source: string` - the source path to load the content file from
* `file: string` - the file name to load the content from 
* `providedIn: 'root'|Type<T>` - determines which injector will provide the resolver. Defaultls to 'root' when left unspecified

---

```typescript
public resolve(route: ActivatedRouteSnapshot): Observable<any>;
```
The resolving method, as per the [Resolve](https://angular.io/api/router/Resolve) interface, returning the dynamic content asynchronously.

---
&nbsp; 

## ContentRouterModule
Replaces the standard [RouterModule](https://angular.io/api/router/RouterModule), within child lazily loaded modules, to install the  resolvers suitable for loading the requested content.

```typescript
@NgModule()
export class ContentRouterModule {

  static forChild(routes: RoutesWithContent): ModuleWithProviders<ContentRouterModule>;
}
```

&nbsp;

**Methods**

---

```typescript
static forChild(routes: RoutesWithContent): ModuleWithProviders<ContentRouterModule>;
```

Creates the module suitable to handle routes with content. This is equivalento to the Angular's Router [forChild](https://angular.io/api/router/RouterModule#forChild).
* `routes: RoutesWithContent` - the array of routes including the requested content 
```typescript
export interface RouteWithContent extends Route {
  source?: string;
  content?: string|string[];
  children?: RoutesWithContent;
}

export type RoutesWithContent = RouteWithContent[];
```

|**Value**|**Description**|
|:--|:--|
|`source?: string`|Optional source path to alternatively load the content file from|
|`content?: string`\|`string[]`|A string, or an array of strings, with the name(s) of the file(s) to load the content from|
|`children?: RoutesWithContent`|Array of child RoutesWithContent objects that specifies a nested route configuration|

---
->
[Next Topic](docs/toc?go=next) 
->
