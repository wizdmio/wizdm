# **apps/wizdm**

## Styling
* Turn the explorer into a list of cards without picture such as [appfutura](https://www.appfutura.com/app-projects)
* Get inspired from [fanvestory](https://fanvestory.com) and [dovetail](https://dovetailapp.com/)

## Navigator
* Consider to extend  `wm-errors` component into a `wm-notify` component including an informative message input as well
* Refactor the action bar getting rid of the action enabler leveraging on the `buttons$` observable instead, so, that enableAction() can be implemented simlarly to performAction() and eventually other functions to dynamically change labels as well. 
* ~~Improve ToolbarService with:~~
  * ~~Adding the default value to start with to the `actionEnabler()` funciton~~
  * ~~Add an `isEnabled()` funciton to the ActionEnabler class ( returning BehaviourSubject().value )~~
  * Adding a general `enableAction()` function to search for the action code and enable/disable the corresponding action
* ~~Collects navigator's guards, resolver and directives under navigator/utils folder~~
* Refactors the toolbar animations once the [animateChild() bug](https://github.com/angular/angular/issues/27245) has been fixed

## Elements
* Consider to apply `encapsulation: ViewEncapsulation.None` to all elements while the global styling will be managed by specific classes
* Move all the relevant material style tweaks from app/_theme.scss to _elements.scss 
* Change the default size of `wm-icon` / `wm-avatar` to 100%, so, to fit within the container by default
* ~~Improve `wm-avatar` to always display the svg while loading the image and accept a color input based on theme palettes (same as `wm-inkbar`)~~

## Document
* Implements an HTML renderer to be used while copying to the clipboard and for PDF creation?

## Editor
* Refactor the document toc, so, to become a side bar with author properties and toc
* ~~Implements a responsive version of the editing bottombar so to accomodate for undo/redo buttons~~
* Redirects cut/copy/past bottombar or contextmenu calls to the document using [`execCommand()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
* Implements link url editing, insert table and insert picture functionalities
* Implements a press-and-hold tool for extended akphabet support. See [press and hold](https://github.com/kasperpeulen/PressAndHold) and [long press](https://github.com/quentint/long-press)

## libs/various
* ~~Move out elements creating libs/elements (@wizdm/elements)~~
* Move out document creating libs/document (@wizdm/document)
* ~~Consider to remove AuthModule, DatabaseModule and UploaderModule from app.module since they are already included by UserProfileModule~~

# libs/connect
* Adds a configuration token to UserModule, so, to let users configure database "paths" and upload "folders"
