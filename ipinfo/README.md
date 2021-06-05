# IP-based Geolocation provider for Angular
The package provides an observable-based service emitting IP related geo-location data coming from one of the following API services:
* [IPList.cc](https://iplist.cc) - Free IP information, country level
* [IpInfo.io](https://ipinfo.io) - Freemum (up to 50K request/month), country and city level
* [GeoJS.io](https://www.geojs.io) - Highly available, free, country level
* [FreeGeoIP.app](https://freegeoip.app) - Free IP Location API, country level
The provider can be selected during module initialization.

## Installation
Import the *IpInfoModule* module in your root module calling the static `init()` function to setup it up:
```typescript
import { IpInfoModule, IP_LIST_CC } from '@wizdm/ipinfo';

@NgModule({
  imports: [
    ...
    IpInfoModule.init({
      provider: IP_LIST_CC
    })
  ]
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Usage Example
The package provides a `IpInfo` service to be used like an observable:

```typescript
import { IpInfo, IpListCC } from '@wizdm/ipinfo';
...
@Component(...)
export class MyComponent()

  private sub: Subscription;

  constructor(readonly info: IpInfo<IpListCC>) {

    this.sub = info.subscribe( data => {

      console.log(data);

    });    
  }
  ...
  ngOnDestroy() { this.sub.unsubscribe(); }
  ...
}
...
```

Being an observable the `IpInfo` service can be used in a template too:

```html
...
<p>{{ info | async | json }}</p>
...
```