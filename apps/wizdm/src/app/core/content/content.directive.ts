import { Directive, Input, HostListener, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContentResolver } from './content.service';

class ContentNavigator {

  constructor(protected content: ContentResolver, protected dialog: MatDialog) { }

  protected navigate(url: string): Promise<boolean> {
    // Closes all dialogs
    this.dialog.closeAll();
    // Navigate to the destination redirecting whenever necessary
    return this.content.navigateByUrl(url); 
  }
}

@Directive({
  selector: ':not(a)[contentLink]'
})
export class ContentDirective extends ContentNavigator {

  constructor(content: ContentResolver, dialog: MatDialog) { super(content, dialog); }

  @Input('contentLink') private url: string;

  @HostListener('click') onClick() { return this.navigate(this.url), false; }
}

@Directive({
  selector: 'a[contentLink]'
})
export class ContentDirectiveWithHref extends ContentNavigator {

  constructor(content: ContentResolver, dialog: MatDialog) { super(content, dialog); }

  @Input('contentLink') private url: string;

  @HostBinding('href') get href() { return this.url; }

  @HostListener('click') onClick() { return this.navigate(this.url), false; }
}
