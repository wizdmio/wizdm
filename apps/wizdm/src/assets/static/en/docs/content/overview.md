<!-- toc: docs/reference.json -->

# Content Management
 Content data in Wizdm is divided in *Static* content and *Dynamic* content. 

## Static Content
For static content we mean pages of informative content with minimal to no interaction capabilities such as the *About* or the *Terms and Conditions* page. This very reference guide belongs to the static content as well. 

The rendering engine for static content is the [@wizdm/markdown](docs/content/markdown) package processing markdown formatted source files hosted in the */assets/docs* folder. Syntax highlighting is provided by the [@wizdm/prism](docs/content/prism) package when needed. 

### Routing
Every route configuration not matching any of the dynamic page routes will end up feeding the *StaticPageModule*. While loading the module, the *Router* will invoke the [StaticResolver](https://github.com/wizdmio/wizdm/blob/master/apps/wizdm/src/app/pages/static/static-resolver.service.ts) attempting to load the content from a md file matching the given route segments. 

To do so, a custom [url matcher](https://angular.io/api/router/UrlMatcher) is used by the module:

->

```typescript
/** Static content route matcher */
export function staticMatcher(url: UrlSegment[]): UrlMatchResult {

  // Builds the posParams from the url sub segments
  const posParams = url.reduce( (params, url, index) => {

    params[`path${index}`] = url;
    return params;

  }, {});

  // Matches all the routes passing along the sub segments as pos parameters
  return { consumed: url, posParams };
}
```
###### The staticMatcher function

<-

With this matcher, the module matches every input url, no matter the depth, and turns the segments into enumerated position parameters. These parameters will then be chained by the *StaticResolver* to build the full path of the file to load.

In the eventuality the loader will fail to load the requested file, the routing will be redirected to the *NotFound* page.

### Table Of Content
Optionally, static content files may refer to a *Table Of Content* object. The table of content is a json file, located in the *assets/docs* folder too, describing the relationship among static content files and enabling foreward and backward navigation: 

->

```javascript
[
  { "label": "Getting Started", "link": "docs/start" },

  { "label": "Basics", "items": [

    { "label": "Environment", "link": "docs/environment" },
    { "label": "Styling", "link": "docs/styling" },
    { "label": "Scrolling", "link": "docs/scrolling" }
  ]},

  { "label": "Content Management", "link": "docs/content" },
...
]
```
###### Example of toc.json file

<-

Once the table of content is load, navigation is possible by means of the following [ActionLinks](docs/navigator/actionlink):
* `docs/toc?go=next` - to navigate towards the next topic.
* `docs/toc?go=back` - to navigate back to the previous topic.

Static content files use comments, within the markdown formatted text, to declare which *table of content* they belong to. Something like `<!-- toc: global.json -->` refers to a *global.json* file.

## Dynamic Content
Dynamic content refers to the data loaded while routing to serve custom pages. Every caption, label, icon, link or text rendered by the page template is provided as dynamic content, so, to keep the template and the content isolated facilitating the management of multiple languages at run-time. 

### Content Manager
`@wizdm/content` package provides the features for automatically install content resolvers to load content files from assets while routing lazily loaded modules. Use the `wmContent` structural directive to select the relevant content within the template: 

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

### Content Loading
The requested content is loaded by means of [resolvers](https://angular.io/guide/router#resolvers) during routing. Which content to load is specified in the *RoutesWithContent* array of each routed feature module. The proper resolvers are created at run-time while lazily loading the module. 

---
->
[Next Topic](docs/toc?go=next) 
->
