**apps/wizdm**

* Refines navigator by using `<main>` element as viewport container instead of a `<div>`
* Replaces navigator/mat-divider by animating header bottom shadow instead `box-shadow: 0 0 10px rgba(black, 0.5)`
* Improves navigator converting wmViewport directive to wm-(scroll)view component relying on general NavigatorService istead of ViewportService
* Collects navigator's guards, resolver, service and directives under navigator/utils folder
* Converts wmFitViewport directive into wmFitView directive
* Improve pages/project using `<nav>` element for toc (and eventually remove some classes by means of attr.display)
* Move the action bar out of the toolbar into the navigation header
* Move out elements creating libs/elements
