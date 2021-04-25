# Action links
@wizdm/actinlink enables Angular's Router to execture custom actions besides regular navigation tasks.

## Installation
Use `npm` to install the @wizdm/actionlink module:

```
npm install @wizdm/actionlink
```

## Usage 
Import the `ActionLinkObserver` service and use it as a (CanActivate guard)[https://angular.io/api/router/CanActivate] within the routes you want to associate with your custom actions:

``` typescript
import { ActionLinkObserver } from '@wizdm/actionlink';
...
const routes: Routes = [

  { 
    path: 'home', component: HomeComponent, children: [
      ...
      // Custom action getting back to the previous page
      { path: 'back', canActivate: [ ActionLinkObserver ] },

  ]}
...
];
```

Use `back` as a regular link in your template.

``` html
...
  <a routerLink="back">Back</a>
...
```

Implement the custom action logic within your component or directive:

``` typescript
import { ActionLinkObserver } from '@wizdm/actionlink';
import { Location } from '@angular/common';
...
export class HomeComponent implements OnDestroy {

  private sub: Subscription;

  constructor(observer: ActionLinkObserver, location: Location) { 
    
    // Registers to the 'back' actionlink to navigate back on request
    this.sub = observer.register('back').subscribe( () => location.back() );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
``` 

Multiple actions can be implemented within the same component by registering the corresponding handles to their respective action codes.
Custom observers for dedicated actions can also be implemented by extending the `ActionLinkObserver` and wrap the custom logic within it:

``` typescript
import { ActionLinkObserver } from '@wizdm/actionlink';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
...
@Injectable({
  providedIn: 'root'
})
export class BackLinkObserver extends ActionLinkObserver implements OnDestroy {

  private sub: Subscription;

  constructor(location: Location, router: Router) { 
    
    super(router); 

    // Registers to the 'back' actionlink to navigate back on request
    this.sub = this.register('back').subscribe( () => location.back() );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
```

Use your custom observer instead of the `ActionLinkObserver` within your ROUTE to make it works.

## How It Works
The `ActionLinkObserver` works as a `CanActivate` routing guard preventing the navigation and pushing the action through a `ReplaySubject` clients can subscribe to. Query Parameters are also packed into an object and passed along as a data payload for the client to act upon, when needed.
