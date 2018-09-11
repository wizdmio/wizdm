# Wizdm library

## Core

Core features and general purpose utilities go here

* Utils
* WindowRef
* CookieService as Cookie
* ContentService as ContentManager

## Connect

Interegration features go here

### Firebase

* AuthService
* DatabaseService, DatabaseDocument, DatabaseCollection, PagedCollection, RealtimeCollection
* UserProfile
* UploaderService (as FileUploader)

### Mailerlite

* MailerliteService

### Unsplash

* UnsplashService


## Elements

UI components extending @angular/material. Defining how to cope with component styling is mandatory prior to move these components into the lib.

* MarkdownComponent as MarkdownRenderer (requires styles refactoring)
* ColorsComponent as ColorPicker, COLOR_MAP, ColorsDirective
* Disclaimer
* OpenFileComponent, FileSizePipe, DropZoneDirective
* FilterComponent as ViewFilter
* IconComponent (as IconPlus)
* AvatarComponent as Avatar (requires default color style)
* LikesComponent as LikesCounter
* ErrorComponent as DisplayError (requires refactoring)