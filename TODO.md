# **apps/wizdm**

## Styling
* Turn the explorer into a list of cards without picture such as [appfutura](https://www.appfutura.com/app-projects)
* Get inspired from [fanvestory](https://fanvestory.com) and [dovetail](https://dovetailapp.com/)
* ~~Review the overall color styling, so, to use a darker default text color to be mitigated by a global opacity level on `p` elements~~
* ~~Setting up the color schemes to be applied to global elements (blockquotes, p, h1-6, ...) within `wm-init-application-theme()`~~

## Utils
* ~~Implements an externalUrl redirector using angular Router (see: https://medium.com/@adrianfaciu/using-the-angular-router-to-navigate-to-external-links-15cc585b7b88)~~
* ~~Upgrade the ContentResolver using `router.routerState.root` (aka ActivatedRoot) to provide a data content observable out of the `select()` instead of the latest snapshot~~
* ~~Refactor the `ContetResolver` to push the `data` snapshot into a `data$` observable so to implement asynchronous content update independenlty from `ActivatedRoot` (since it can't be sucessfully injected into services by design). Implements an `asObservable(select, defaults)` function for piping~~
* ~~Refactor the redirect-handler into a canActivate guard for better performances.~~

## Navigator
* ~~Refactor the `wm-footer` to automatically show/hide the language seleciton based on `resolver.user.language` property (so removing the input)~~
* ~~Restyle the footer to have social links on the left, terms and language on the right.~~
* ~~Refactor the footer social link to use the externalUrl redirector~~
* ~~Restyle the footer to a taller version with accent-like background and reacher informations~~
* Refactor `wm-errors` so to push errors into a pipe allowing multiple error messages via delayed obsevable.
* Consider to extend  `wm-errors` component into a `wm-notify` component including an informative message input as well
* ~~Refactor the action bar getting rid of the action enabler leveraging on the `buttons$` observable instead, so, that enableAction() can be implemented simlarly to performAction() and eventually other functions to dynamically change labels as well.~~ 
* ~~Improve ToolbarService with:~~
  * ~~Adding the default value to start with to the `actionEnabler()` funciton~~
  * ~~Add an `isEnabled()` funciton to the ActionEnabler class ( returning BehaviourSubject().value )~~
  * Adding a general `enableAction()` function to search for the action code and enable/disable the corresponding action
* ~~Collects navigator's guards, resolver and directives under navigator/utils folder~~
* Refactors the toolbar animations once the [animateChild() bug](https://github.com/angular/angular/issues/27245) has been fixed
* ~~Consider refactoring the content resolver so to dynamically load the content for each page on demand supporting lazy loading too~~
* Improve navigation bar with "type" property to switch among normal button/link, strong or notification (showing the badge)
* ~~Refactor the navigation bar replacing most of the padding on buttons with a gap between them ( let's say from 16px to 4px + 24px gap so the wizdm button will get closer to the logo)~~
* Add a notification button to display instead of the full navigation bar on mobile version
* Consider to refactor the ViewPort service using `CdkScrollable` and `CdkViewRuler`

## Editor
* Refactor the document toc, so, to becomewith dark background and reacher informations a side bar with author properties and toc using `mat-drawer-container`
* ~~Implements a responsive version of the editing bottombar so to accomodate for undo/redo buttons~~
* Redirects cut/copy/past bottombar or contextmenu calls to the document using [`execCommand()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
* Implements link url editing, insert table and insert picture functionalities
* Implements a press-and-hold tool for extended akphabet support. See [press and hold](https://github.com/kasperpeulen/PressAndHold) and [long press](https://github.com/quentint/long-press)

## Pages
* ~~Turn every page into a module to be eventually lazely loaded~~
* ~~Uploads: improve thumbnails so to have a fixed size while picture is loading~~
* ~~Rename `user` into `profile` for the sake of clarity~~

## Elements
* ~~Move all the relevant material style tweaks from app/_theme.scss `wm-init-application-theme()` to _elements.scss `wm-elements-theme()`~~
* Change the default size of `wm-icon` / `wm-avatar` to 100%, so, to fit within the container by default
* ~~Improve `wm-avatar` to always display the svg while loading the image and accept a color input based on theme palettes (same as `wm-inkbar`)~~

## Document
* Implements an HTML renderer to be used while copying to the clipboard and for PDF creation?
* ~~Move the core editable-document component, editable-** classes and editable-selection service to libs/document and refactor the editor to use local version of toolbox and context menu~~

## libs/connect
* Adds a configuration token to UserModule, so, to let users configure database "paths" and upload "folders"
* Replace the AngularFirestoreModule with DatabaseModule dependency in UploaderModule
* Overwrites AngularFirestoreConfiguraiton in DatabaseModule so to remove the latest firebase error (see: https://github.com/angular/angularfire2/issues/1993)

## libs/various
* ~~Move out elements creating libs/elements (@wizdm/elements)~~
* ~~Move out document creating libs/document (@wizdm/document)~~
* ~~Consider to remove AuthModule, DatabaseModule and UploaderModule from app.module since they are already included by UserProfileModule~~

## ~~libs/content~~
* ~~Refactors the `use()` function to support incremental module loading~~
* ~~Implement recursive content copy function to better merge loaded content with the default one~~
* ~~Tweak the recursive content copy to overwrite the full array content on length mismatch (so preventing shifted translations)~~