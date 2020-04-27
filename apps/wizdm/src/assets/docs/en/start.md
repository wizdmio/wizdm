# Getting Started

<!-- toc: toc.json -->

[Back](back) - [Github](https://github.com/wizdmio/wizdm/tree/master)

Wizdm is an evolving boilerplate designed to help developers getting started with their single page applications. It is based upon the [Angular Framework](https://angular.io) and utilizes several well known packages and technologies:

* [Material Design](https://material.io) as the design and styling system backed by the [Angular Material](https://material.angular.io) package. This includes the [Component Dev Kit (CDK)](https://material.angular.io/cdk) to implement common interaction patterns. Additionally, the [Font Awsome](https://fontawesome.com) icons are widely used to complement the essential [Material Icon set](https://material.io/resources/icons).
* [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox) is the main layout system to ensure a smooth and responsive navigation thank to the help of the [Angular Layout](https://github.com/angular/flex-layout/wiki) package.
* [Firebase](https://firebase.google.com) as the primary backend leveraging the [Angular Fire](https://github.com/angular/angularfire) package. Wizdm was born as a serverless application, so, it is likely to stay that way althougt contributions to expand its backend capabilities are more than welcome.
* [Hammer](https://hammerjs.github.io) is used behind the scenes to handle gestures on mobile devices.
* [Moment](https://momentjs.com) to manage date with locales across the application.

If you are new to Angular, see Angular's full [Getting Started](https://angular.io/start) and [Setting up your environment](https://angular.io/guide/setup-local) guides.

## Workspace
The workspace has been converted from the original angular-cli to the monorepo format suggested by [Nrwl](https://nrwl.io) using their [Nx Angular Extension](https://nx.dev/angular/getting-started/why-nx). This means both the source code of the web application(s) and the  potentially shared libraries are stored in the same single repository under the [/apps](https://github.com/wizdmio/wizdm/tree/master/apps) and [/libs](https://github.com/wizdmio/wizdm/tree/master/libs) folders respectively.

## Wizdm Demo App
The main application code is located at [/apps/wizdm/src](https://github.com/wizdmio/wizdm/tree/master/apps/wizdm/src) and structured as per the following:
```
/apps/wizdm/src
├──/app
|  ├──/auth
|  ├──/dialogs
|  ├──/navigator
|  ├──/pages
|  ├──/home
|  ├──/utils
|  ├── app.component.ts
|  └── app.module.ts
├──/assets
|  ├──/docs
|  ├──/i18n
|  └──/img
├──/environments
├──/styles
├── main.ts
└── index.html
 ```
As for any Angular application, the `main.ts` file bootstraps the `AppModule` loading and initializing all the common root level feature modules to be available across the application. The `AppComponent` impersonates the `body` element using `ViewEncapsulation.None`, so, for its styling to be applied globally and delegates the `NavigatorModule` to take over and manage the application routing.
