
<img src="apps/wizdm/src/assets/img/wmlogo.png" align="left" width="76" />

Wizdm
=====

[![status](https://img.shields.io/badge/status-stealth-000.svg)](https://wizdm.io)
[![stability](https://img.shields.io/badge/stability-experimental-yellow.svg)](https://wizdm.io)
[![ngversion](https://img.shields.io/github/package-json/dependency-version/wizdmio/wizdm/@angular/core.svg?label=angular)](.)
[![issues](https://img.shields.io/github/issues/wizdmio/wizdm.svg)](https://github.com/wizdmio/wizdm/issues)
[![contribution](https://img.shields.io/badge/contributions-welcome-important.svg)](mailto:hello@wizdm.io)
[![license](https://img.shields.io/github/license/wizdmio/wizdm.svg?color=blue)](LICENSE.md)

Wizdm is an online community meant to connect aspiring startuppers with compassionate developers sharing the common goal of turning a valuable business ideas into functioning prototypes. That's the stage when the idea can be actually tested, refined and seek for investors.

## Developers' notes

The project revolves around a web-app running on [Angular][angular] + [Angular Material][angular-material] + [FlexLayout][flexlayout] with a minimal clean interface to fit both desktop and mobile. Icon set comes from both [Material][material] and [FontAwesome][fontawesome]. Including [Hammerjs][hammerjs] to handle gestures for material components. Using [Moment][momentjs] for time and locale management.

## Monorepo

The workspace has been converted from the original angular-cli to the monorepo format suggested by [Nrwl][nrwl] using their Nx Angular Extension [@nrwl/schematics][nrwl-schematics]. This means both the source code of the web application(s) and the external potentially shared libraries are stored in the same single repository under the `/apps` and `/libs` folders respectively.

## Multi-language support

The project uses a content manager service to dynamically load contents in different languages by use of a resolver to pre-fetch localilzed content from 'assets/i18n' prior to load the navigator component. The service is then injectend into the components (pages) needing to get localized contents making sure the content is always fully loaded and available to the target container prior to get initialized.

At first start, the resolver checks the authenticated user language preferences falling back detecting the browser language when unavailable (aka the user is not logged in). This provides the useful side effect of preventing the initial page from flickering between unlogged and logged-in statuses while an already logged-in user is loading the app from scratch.

The navigation system is used to switch among languages, so, from the user perspective, it looks like having multiple apps in different languages (e.g. https://wizdm.io/en/home for English or https://wizdm.io/it/home for Italian).

The localized content is provided as an observable granting smooth transitions while switching languages without the need of reloading the full page nor the app.

The same resolver is used as a guard for both activating/deactivating pages while routing.

## Development server

Run `ng serve` for a dev server. Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.
Please note that --ssl option is enabled by default using local ssl/server.crt and ssl/servr.key files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component to be added to the default project (apps/widm) or specify `--project=project-name` otherwise. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

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

[wizdm]: https://wizdm.io
[angular]: https://angular.io
[material]: https://material.io
[angular-material]: https://material.angular.io
[flexlayout]: https://github.com/angular/flex-layout/wiki
[fontawesome]: https://fontawesome.com
[hammerjs]: https://hammerjs.github.io
[momentjs]: https://momentjs.com
[nrwl]: https://nrwl.io
[nrwl-schematics]: https://nrwl.io/nx/guide-getting-started
