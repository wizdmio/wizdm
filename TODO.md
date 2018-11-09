**apps/wizdm**

* Remove the ContentManager dependency from wm-logo using a caption input instead
* Move out elements creating libs/elements
* Spreads the wm-navbar components into the navigator (eventually contained into a `mat-toolbar` component)
  * `wm-logo` routing to home
  * `wm-navba`r containing the navlinks only
  * `wm-toggler` button for mobile version
  * `wm-avatar` button when signedIn
* Consider to go back using `mat-toolbar-row` to wrap the action bar
* Improve ToolbarService with:
  * ~~Adding the default value to start with to the `actionEnabler()` funciton~~
  * ~~Add an `isEnabled()` funciton to the ActionEnabler class ( returning BehaviourSubject().value )~~
  * ~~Adding a general `enableAction()` function to search for the action code and enable/disable the corresponding action~~
* Collects navigator's guards, resolver and directives under navigator/utils folder
* Improve pages/project using `<nav>` element for toc (and eventually remove some classes by means of attr.display)
* Implements toolbar cut/copy/paste and undo/redo using [`execCommand()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) in project page while editing
* ~~Move the action bar out of the toolbar into the navigation header splitting it into: wm-navbar & wm-toolbar~~

