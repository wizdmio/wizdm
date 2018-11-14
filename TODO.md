# **apps/wizdm**

## Styling
* Reconsider to implement an homepage with a banner and a short description
* Rearrange the navbar/toggler/logo to the left like (angular.io)[https://angular.io/] keeping the profile button on the right
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
* Collects navigator's guards, resolver and directives under navigator/utils folder

## Various
* Move out elements creating libs/elements
* Improve pages/project using `<nav>` element for toc (and eventually remove some classes by means of attr.display)
* Implements toolbar cut/copy/paste and undo/redo using [`execCommand()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) in project page while editing


# libs/connect

* Adds a configuration token to UserModule, so, to let users configure database "paths" and upload "folders"
