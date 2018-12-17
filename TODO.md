# **apps/wizdm**

## Styling
* Updates all the page selectors adding a "-page" suffix such as `wm-login-page` and "-dlg" suffix for popup dialogs suc as `wm-user-info-dlg`.
* Reconsider to implement an homepage with a banner and a short description
* Rearrange the navbar/toggler/logo to the left like [angular.io](https://angular.io/) keeping the profile button on the right
* Turn the explorer into a list of cards without picture such as [appfutura](https://www.appfutura.com/app-projects)
* Get inspired from [fanvestory](https://fanvestory.com) and [dovetail](https://dovetailapp.com/)

## Navigator
* ~~Remove the ContentManager dependency from `wm-logo` using a caption input instead and update the toolbar accordingly~~
* Consider to extend  `wm-errors` component into a `wm-notify` component including an informative message input as well
* ~~Move the action bar out of the toolbar into the navigation header splitting it into: wm-navbar & wm-toolbar~~
* ~~Spreads the wm-navbar components into the navigator (eventually contained into a `mat-toolbar` component)~~
  * ~~`wm-logo` routing to home~~
  * ~~`wm-navbar` containing the navlinks only~~
  * ~~`wm-toggler` button for mobile version~~
  * ~~`wm-avatar` button when signedIn~~
* ~~Consider to go back using `mat-toolbar-row` to wrap the action bar~~
* ~~Improve ToolbarService with:~~
  * ~~Adding the default value to start with to the `actionEnabler()` funciton~~
  * ~~Add an `isEnabled()` funciton to the ActionEnabler class ( returning BehaviourSubject().value )~~
  * ~~Adding a general `enableAction()` function to search for the action code and enable/disable the corresponding action~~
* ~~Collects navigator's guards, resolver and directives under navigator/utils folder~~
* Refactors the toolbar animations once the [animateChild() bug](https://github.com/angular/angular/issues/27245) has been fixed
* Improve the top bar avatar to support login/logout states. @see: https://wizdm-login-flip.stackblitz.io

## Project
* Improve pages/project using `<nav>` element for toc (and eventually remove some classes by means of attr.display)
* Consider to add a project avatar (using the user uploader?)
* Implements toolbar cut/copy/paste and undo/redo using [`execCommand()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) in project page while editing

## Various
* Move out elements creating libs/elements
* Remove AuthModule, DatabaseModule and UploaderModule from app.module since they are already included by UserProfileModule

# libs/content
* ~~Move ContentResolver out of the lib~~

# libs/connect
* Adds a configuration token to UserModule, so, to let users configure database "paths" and upload "folders"

# libs/markdown
* ~~Gets rid of wrapper sevices by means of an intermediate JS module. See: https://stackblitz.com/edit/wizdm-markdown?file=src%2Fapp%2Fmarkdown%2Freparse-module.js~~
* ~~Investigate how to embed the process shim (node)~~
