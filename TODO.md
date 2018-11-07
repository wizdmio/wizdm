**apps/wizdm**

* Refines navigator by using <main> element as viewport container instead of a <div>
* Improves navigator converting wmViewport directive to wm-(scroll)view component relying on general NavigatorService istead of ViewportService
* Collects navigator's guards, service and directives under navigator/utils folder
* Converts wmFitViewport directive into wmFitView directive
* Improve pages/project using <nav> element for toc (and eventually remove some classes by means of attr.display)
* Replaces navigator/mat-divider by animating header bottom shadow instead 
* Move the action bar out of the toolbar into the navigation header
* Move out elements creating libs/elements
