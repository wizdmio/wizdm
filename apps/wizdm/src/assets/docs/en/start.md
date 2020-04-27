# Getting Started

<!-- toc: toc.json -->

[Go Back](back) - [Continue Next](docs/next)

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
|  |  └── user.service.ts
|  ├──/dialogs
|  ├──/navigator
|  |  ├── ...
|  |  ├── navigator-routing.module.ts
|  |  └── navigator.module.ts
|  ├──/pages
|  ├──/utils
|  ├── app.component.ts
|  └── app.module.ts
├──/assets
|  ├──/docs
|  |  ├──/en
|  |  ├──/it
|  |  └──/..
|  ├──/i18n
|  |  ├──/en
|  |  ├──/it
|  |  └──/..
|  └──/img
├──/environments
|  ├── common.ts
|  └── secrets.ts
├──/styles
├── main.ts
└── index.html
 ```
 ### Bootstrap and Routing
As for any Angular application, the `main.ts` file bootstraps the `AppModule` loading and initializing all the common root level feature modules to be available across the application. The `AppComponent` impersonates the `body` element using `ViewEncapsulation.None`, so, for its styling to be applied globally and delegates the `NavigatorModule` to take over and manage the application routing inits `NavigationRoutingModule`.

### Auth
The `/auth` folder contains the `UserProfile` service, a sigleton providing the currently authenticated user information across the overall application. User authentication, howewver, is handled by the `AuthService` belonging to the [@wizdm/connect](docs/connect) package and it is explained in full under the [Authentication section](docs/auth).  

### Dialogs
The `/dialogs` folder contains the application's shared modal dialogs the most important of which are the login dialog, providing all the user interactions needed for user authentication and managemet, and the feedback dialog, providing a form to collect the user's feedbacks.  
Every dialog is a self-contained module activated by its corresponding [ActionLink](docs/actionlinks) observer.

### Pages
The `/pages` folder contains the application's pages. Every page is a self-contained module lazily loaded by the navigator while routing.

### Assets
Assets are divided in three main categories:
1. Documents, under the `/docs` subfolder, are markdown text files used by the application to render static content pages such as the [About](about), the [Terms and Conditions](terms) or this very reference documentation. Different languages are handled by the corresponding locale subfolder.
1. Content files, under the `/i18n` subfolder, are json files used by the application to dynamically load the relevant content for pages, dialogs and the navigator itself. As for the documents, different languages are handled by the corresponding locale subfolder.
1. Images, under the `/img` subfolder, are the image files available to the application.

### Environment
The `/environments` folder contains the application environment variables grouped by sensitivity. The `common.ts` file contains all the publicly available variables while the file named `secrets.ts` is the one where to store all the sensitive variables such as private API keys and such. More details will be found in the [Environment section](docs/environment).

### Styling
The `/styles` folder containes the `scss` files making up the application theming as explained in full under the [Styling section](docs/styling).

---

[Top](docs/start#getting-started) - [Continue Next](docs/next) 
