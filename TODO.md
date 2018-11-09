**apps/wizdm**

* Improve ToolbarService with:
  * ~~Adding the default value to start with to the `actionEnabler()` funciton~~
  * ~~Add an `isEnabled()` funciton to the ActionEnabler class ( returning BehaviourSubject().value )~~
  * ~~Adding a general `enableAction()` function to search for the action code and enable/disable the corresponding action~~
* Collects navigator's guards, resolver and directives under navigator/utils folder
* Improve pages/project using `<nav>` element for toc (and eventually remove some classes by means of attr.display)
* ~~Move the action bar out of the toolbar into the navigation header splitting it into: wm-navbar & wm-toolbar~~
* Move out elements creating libs/elements
