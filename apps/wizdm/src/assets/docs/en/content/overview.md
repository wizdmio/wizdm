<!-- toc: reference.json -->

# Content Management
Data content in Wizdm is divided in *Static* content and *Dynamic* content. 

## Static Content
For static content we mean pages of informative content with minimal to no interaction capabilities such as the *About* or the *Terms and Conditions* page. This very reference guide belongs to the static content as well. 

The rendering engine is the [@wizdm/markdown](docs/content/markdown) package processing source md files statically hosted in the */assets/docs* folder. Syntax highlighting is provided by the [@wizdm/prism](docs/content/prism) package when needed. 

### Routing
Every route configuration not matching any of the dynamic page routes will end up feeding the *StaticPageModule*. While loading the module, the *Router* will invoke the [StaticResolver]() attempting to load the content from a md file matching the given route segments. 

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

Static content files use comments to declare which *table of content* they belong to like: `<!-- toc: global.json -->` to refer to a *global.json* file.

## Dynamic Content
Dynamic content...
