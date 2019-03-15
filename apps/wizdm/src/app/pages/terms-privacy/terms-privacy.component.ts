import { Component, OnInit, Input, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    this.scroll.scrollToElement(anchor);
  }
}
