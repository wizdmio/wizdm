import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  
  constructor(private http   : HttpClient,
              private scroll : ViewportService) {
  }

  public document = "";

  ngOnInit() {
    // Loads the document from assets
    this.loadDocument('assets/doc/terms.md')
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
