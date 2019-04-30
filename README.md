
Wizdm
=====

Wizdm uses a minimal clean interface based on Angular Material and FlexLayout to fit both desktop and mobile.

## Developers' notes

The app runs on Angular 6 + Material + FlexLayout.
Icon set comes from both Material and Font awesome.
Including hammerjs (https://hammerjs.github.io) to handle gestures for material components
Using moment (https://momentjs.com) for time and locale management

## Monorepo

The workspace has been converted from the original angular-cli to the monorepo format suggested by [Nrwl](https://nrwl.io/)
using their Nx Angular Extension [@nrwl/schematics](https://nrwl.io/nx/guide-getting-started)

## Multi-language

We use a content manager service to dynamically load contents in different languages by use of a resolver to pre-fetch localilzed content from 'assets/i18n' prior to load the navigator component.

The resolver checks the authenticated user language preferences when available too.

The same resolver is used as a guard for both activating/deactivating pages while routing.

We use the navigation system to switch among languages, so, from the user perspective, it looks like having multiple apps in different languages (e.g. https://wizdm.io/en/home for English or https://wizdm.io/it/home for Italian).

The service is then injectend into the components needing to get localized contents.  

This approach makes sure the content is always fully loaded and available to the navigator and all the children components (aka no need of observables).

The same resolver is used to ensure user authentication syncs prior to load and to fetch user language preferences when available.

## Development server

Run `ng serve` for a dev server. Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.
Please note that --ssl option is enabled by default using local ssl/server.crt and ssl/servr.key files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Firebase

The project is currently hosted on [Firebase](https://firebase.google.com/) and the last deploied version is available at https://wizdm.io

Run `firebase deploy` to upload the last build.

## Repository

Source code is now mantained on [GitHub](https://github.com/wizdmio/wizdm).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
