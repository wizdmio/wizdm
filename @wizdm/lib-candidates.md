# wizdm library

## Core

Core features depending on @angular/core and @angular/fire

* ContentService as ContentManager
* AuthService
* DatabaseService, DatabaseDocument, DatabaseCollection, PagedCollection, RealtimeCollection
* UserProfile
* UploaderService (as FileUploader)
* WindowRef

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