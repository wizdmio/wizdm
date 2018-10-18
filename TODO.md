**apps/wizdm**

* Refactor @wizdm/content the following way:
    * Move switch() from ContentManager to ContentResolver, elimkinating the Router dependency from the Manager
    * Turn the ContentManager instance within the ContentResolver to public
    * Replace the LanguageResolver with a virtual method of the ContentResolver to be extended
* Refactor @wizdm/connect to remove @wizdm/content dependency from UserProfile dropping the LanguageResolver implementation and the UserProfileModule static resolveLanguage() funciton
* Implementing a local Resolver in widzm app extending ContentResolver and resolving language by using UserProfile locally
* Move out /elements creating libs/elements
* 