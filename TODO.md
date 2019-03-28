# **apps/wizdm**

## Styling
* Turn the explorer into a list of cards without picture such as [appfutura](https://www.appfutura.com/app-projects)
* Get inspired from [fanvestory](https://fanvestory.com) and [dovetail](https://dovetailapp.com/)
* ~~Review the overall color styling, so, to use a darker default text color to be mitigated by a global opacity level on `p` elements~~
* ~~Setting up the color schemes to be applied to global elements (blockquotes, p, h1-6, ...) within `wm-init-application-theme()`~~

## Navigator
* Consider to extend  `wm-errors` component into a `wm-notify` component including an informative message input as well
* Refactor the action bar getting rid of the action enabler leveraging on the `buttons$` observable instead, so, that enableAction() can be implemented simlarly to performAction() and eventually other functions to dynamically change labels as well. 
* ~~Improve ToolbarService with:~~
  * ~~Adding the default value to start with to the `actionEnabler()` funciton~~
  * ~~Add an `isEnabled()` funciton to the ActionEnabler class ( returning BehaviourSubject().value )~~
  * Adding a general `enableAction()` function to search for the action code and enable/disable the corresponding action
* ~~Collects navigator's guards, resolver and directives under navigator/utils folder~~
* Refactors the toolbar animations once the [animateChild() bug](https://github.com/angular/angular/issues/27245) has been fixed
* ~~Consider refactoring the content resolver so to dynamically load the content for each page on demand supporting lazy loading too~~
* Improve navigation bar with "type" property to switch among normal button/link, strong or notification (showing the badge)
* Refactor the navigation bar replacing most of the padding on buttons with a gap between them ( let's say from 16px to 4px + 24px gap so the wizdm button will get closer to the logo)
* Add a notification button to display instead of the full navigation bar on mobile version
* Refactor the footer to a taller version with accent-like background and reacher informations

## Uploads popup
* improve thumbnails so to have a fixed size while picture is loading

## Pages
* Turn every page into a module to be eventually lazely loaded

## Elements
* Move all the relevant material style tweaks from app/_theme.scss `wm-init-application-theme()` to _elements.scss `wm-elements-theme()`
* Change the default size of `wm-icon` / `wm-avatar` to 100%, so, to fit within the container by default
* ~~Improve `wm-avatar` to always display the svg while loading the image and accept a color input based on theme palettes (same as `wm-inkbar`)~~

## Document
* Implements an HTML renderer to be used while copying to the clipboard and for PDF creation?
* Move the core editable-document component, editable-** classes and editable-selection service to libs/document and refactor the editor to use local version of toolbox and context menu

## Editor
* Refactor the document toc, so, to becomewith dark background and reacher informations a side bar with author properties and toc
* ~~Implements a responsive version of the editing bottombar so to accomodate for undo/redo buttons~~
* Redirects cut/copy/past bottombar or contextmenu calls to the document using [`execCommand()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
* Implements link url editing, insert table and insert picture functionalities
* Implements a press-and-hold tool for extended akphabet support. See [press and hold](https://github.com/kasperpeulen/PressAndHold) and [long press](https://github.com/quentint/long-press)

## libs/content
* ~~Refactors the `use()` function to support incremental module loading~~
* ~~Implement recursive content copy function to better merge loaded content with the default one~~
* Tweak the recursive content copy to overwrite the full array content on length mismatch (so preventing shifted translations)

## libs/various
* ~~Move out elements creating libs/elements (@wizdm/elements)~~
* Move out document creating libs/document (@wizdm/document)
* ~~Consider to remove AuthModule, DatabaseModule and UploaderModule from app.module since they are already included by UserProfileModule~~

## libs/connect
* Adds a configuration token to UserModule, so, to let users configure database "paths" and upload "folders"
