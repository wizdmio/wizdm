import { Component, OnInit, Input, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ContentManager } from '@wizdm/content';
import { ViewportService } from '../../navigator';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'

export type displayMode = 'page' | 'popup';

@Component({
  selector: 'wm-terms-privacy',
  templateUrl: './terms-privacy.component.html',
  styleUrls: ['./terms-privacy.component.scss']
})
export class TermsPrivacyComponent implements OnInit {

  // Display mode defaults to 'page'
  @Input() display: displayMode = 'page';
  public msgs;
  
  constructor(private content : ContentManager,
              private http    : HttpClient,
              private dialog  : MatDialog,
              private scroll  : ViewportService) {

    // Gets the localized content
    this.msgs = this.content.select('terms');
  }

  public document = "";

  ngOnInit() {
    // Loads the document from assets
    this.loadDocument(this.msgs.document)
      .subscribe( doc => {
        this.document = doc;
      });
  }

  private loadDocument(path: string): Observable<string> {
    // Loads the MD document file from the given path
    return this.http.get(path, { responseType: 'text' } )
      .pipe( catchError( e => {
        console.error(e);
        return "# Something wrong"; 
      }));
  }

  public navigatePage(anchor: string) {
    // Scroll the main view at the anchor position
    this.scroll.scrollTo(anchor);
  }

  //-- Popup dialog helpers --------

  @ViewChild('popupTemplate') popupTemplate: TemplateRef<TermsPrivacyComponent>;

  private popupConfig: MatDialogConfig = { 
    //panelClass:  'mat-dialog-reset',
    autoFocus: false
    //disableClose: true,
    //data: this
  };

  // Shows the popupTemplate as a popupDialog
  public popup(): Promise<void> {
    return this.dialog.open(this.popupTemplate, this.popupConfig)
      .afterClosed()
      .toPromise();
  }

  @ViewChild('popupContent', { read: ElementRef }) popupContent: ElementRef;

  // Implements a simple "scroll to anchor" for the popup version
  public navigatePopup(url: string) {

    try {
      const el: Element = this.popupContent.nativeElement;
      const elSelectedById = el.querySelector(url);

      if(elSelectedById) {
        elSelectedById.scrollIntoView();
      }
    }
    catch(e) {}
  } 
}
