# Google Tags (Google Analytics) for Angular
Google Tags (also known as Google Analytics) support for Angular.

## Installation
Import the *Gtag* module in your root module calling the static `init()` function to setup it up:
```typescript
import { GtagModule } from '@wizdm/gtag';

@NgModule({
  imports: [
    ...
    GtagModule.init({
      targetId: '<<YOUR GOOGLE ID HERE>>'
    })
  ]
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Usage Example
The package provides a `gtag` directive to be used ...:

```html
...
<section fxLayout="column" fxLayoutAlign="center center" gtag="home">

  <p><b>Google Site Tagging</b> (aka Google Analytics) Example</p>

</section>
...
```

The `gtag="home"` statement in the .html sends a page-view event to the Google Analytics, Google Ads or Google Marketing Platform account you configured during the initialization.

The “home” text will appear in the report to be the page title while the page location is automatically detected by the directive provided the application makes use of a Router.

### Sending Tags Programmatically
The package provides *GtagService* service implementing all the default [Google Analytics events](https://developers.google.com/analytics/devguides/collection/gtagjs/events#default_google_analytics_events):

```typescript
import { GtagService } from '@wizdm/gtag';
...
@Component(...)
export class MyComponent()

  constructor(private gtag: GtagService) {

    gtag.login('Google');

    gtag.search('Bologna')
      .then( () => console.log('Search correctly tagged') )
      .catch( e => console.error(e) );

    gtag.addToCart([{
      id: "P12345",
      name: "Android Warhol T-Shirt",
      list_name: "Search Results",
      brand: "Google",
      category: "Apparel/T-Shirts",
      variant: "Black",
      list_position: 1,
      quantity: 2,
      price: '2.0'
    }]);
  }
  ...
}
...
```

The above example demostrates the way to send a login event (with ‘Google’ as its method) a search event (with ‘Bologna’ as a search term) and a complete add_to_cart e-commerce event.

These methods return a Promise, as the search() call made clear, so to perform asynchronous tasks right after the tagging completed.

## Timeouts
In order to prevent the Promise from never resolving, in the eventuality the `gtag.js` library would fail to load, the package implements a timeout function following [Google’s recommendations](https://developers.google.com/analytics/devguides/collection/gtagjs/sending-data#handle_timeouts).

The default timeout value is set to 10s and can be configured during initialization.