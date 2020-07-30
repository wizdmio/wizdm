<img src="wizdm/src/assets/img/wmlogo.png" align="left" width="76" />

Wizdm
=====

[![status](https://img.shields.io/badge/status-stealth-000.svg)](https://wizdm.io)
[![stability](https://img.shields.io/badge/stability-experimental-yellow.svg)](https://wizdm.io)
[![contribution](https://img.shields.io/badge/contributions-welcome-important.svg)](mailto:hello@wizdm.io)
[![issues](https://img.shields.io/github/issues/wizdmio/wizdm.svg)](https://github.com/wizdmio/wizdm/issues)
[![ngversion](https://img.shields.io/github/package-json/dependency-version/wizdmio/wizdm/@angular/core.svg?label=angular)](.)
[![license](https://img.shields.io/github/license/wizdmio/wizdm.svg?color=blue)](LICENSE.md)

**Live demo:** https://wizdm.io 

Wizdm is a boilerplate to kickstart serverless single page applications based on Angular and Firebase. 
Designed to help aspiring startuppers bootstrapping their side projects into functioning prototypes ready to launch.

## Developers' notes

The project revolves around a [web-app](apps/wizdm) running on [Angular][angular] + [Angular Material][angular-material] + [FlexLayout][flexlayout] with a minimal clean interface to fit both desktop and mobile. Icon set comes from both [Material][material] and [FontAwesome][fontawesome]. Including [Hammerjs][hammerjs] to handle gestures for material components. Using [Moment][momentjs] for time and locale management.

## Firebase

The app relies on several [firebase services][firebase]:

* Firebase Hosting to host the production demo app at https://wizdm.io
* Firebase Auth for user authentication 
* Cloud Firestore realtime database for user's profile and content
* Cloud Storage for user's images and files
* Cloud Functions to run key tasks server-side

Take a look on [@wizdm/connect](libs/connect) library abstracting the communication layer with all the firebase services. 

## Internationalization

The project uses a content resolver to dynamically load contents in different languages by pre-fetching localilzed content from 'assets/i18n'.

At first start, the resolver checks the authenticated user language preferences falling back detecting the browser language when unavailable (aka the user is not logged in). This provides the useful side effect of preventing the initial page from flickering between unlogged and logged-in statuses while an already logged-in user is loading the app from scratch.

The router is used to switch among languages, so, from the user perspective, it looks like having multiple apps in different languages (e.g. https://wizdm.io/en/home for English or https://wizdm.io/it/home for Italian).

The localized content is provided by means of the *wmContent* directive granting smooth transitions while switching languages without the need of reloading the full page nor the app.

Take a look on [@wizdm/content](libs/content) package for further information.

## Development server

Run `ng serve` for a dev server. Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files. Be aware that --ssl option is enabled by default using local ssl/server.crt and ssl/servr.key files.

## Code scaffolding

The workspace is arranged as a monorepo. This means both the source code of the web application(s) and the potentially shared libraries are stored in the same single repository.

```
/
├──/animate  - Animate On Scroll
├──/connect  - Firebase package
├──/content  - Content resolving (multi-language)
├──/elements - UI components
├──/emoji    - Emoji support
├──/markdown - Markdown renedrer
├──/wizdm    - The main app
:
├── angular.json        ⎫
├── firebase.json       ⎪
├── package.json        ⎬ Config files
├── tsconfig.json       ⎪
├── tsconfig.base.json  ⎪
└── tslint.json         ⎭
 ```

Run `ng generate component component-name` to generate a new component to be added to the wizdm default project or specify `--project=project-name` otherwise. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

To generate a new library, run `ng generate lib library-name` that will be automatically added to the workspace as a publishable package.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

Run `firebase deploy` to upload the last build.

## Repository

Source code is now mantained on [GitHub](https://github.com/wizdmio/wizdm).

## Resources

[wizdm]: https://wizdm.io
[angular]: https://angular.io
[material]: https://material.io
[angular-material]: https://material.angular.io
[flexlayout]: https://github.com/angular/flex-layout/wiki
[firebase]: https://firebase.google.com
[fontawesome]: https://fontawesome.com
[hammerjs]: https://hammerjs.github.io
[momentjs]: https://momentjs.com
