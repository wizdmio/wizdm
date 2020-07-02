# Content
Runtime content management by the [Angular Router](https://angular.io/api/router/Router). The package provides a set of features for automatically install content resolvers to load content files from assets while routing lazily loaded modules. The content is then accessible within the same module components' template via the `wmContent` structural directive.

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

The requested content is loaded by means of [resolvers](https://angular.io/guide/router#resolvers) during routing. Which content to load is specified in the *RoutesWithContent* array of each routed feature module. The proper resolvers are created at run-time while lazily loading the module. 
