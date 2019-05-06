import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ViewportService } from '../../navigator';
import { ContentResolver } from '../../core';
import { Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators'

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})
export class StaticComponent {

  readonly document$: Observable<string>;
  
  constructor(private route   : ActivatedRoute,
              private http    : HttpClient,
              private scroll  : ViewportService,
              private content : ContentResolver) {


    this.document$ = this.streamDocument();
  }

  private streamDocument(): Observable<string> {

    // Resolves the requested document name
    return this.route.paramMap.pipe( 
      // Resolves the current language
      switchMap( param => this.content.language$.pipe(
        map( lang => {
          const name = `${param.get('name')}-${lang}`;
          console.log(name);
          return name;
        } )
      )),
      // Loads the file from the assets
      switchMap( name => this.http.get(`assets/docs/${name}.md`, { responseType: 'text' } )),
      // Catches errors
      //catchError( e => "# Something wrong" ) 
    );

    // Resolves the current language first
    return this.content.language$.pipe(
      // Resolves the requested document name
      switchMap( lang => this.route.paramMap.pipe(
        // Maps the full name appending the language code
        map( param => {
          const name = `${param.get('name')}-${lang}`;
          console.log(name);
          return name;
        } )
      )),
      // Loads the file from the assets
      switchMap( name => this.http.get(`assets/docs/${name}.md`, { responseType: 'text' } )),
      // Catches errors
      catchError( e => "# Something wrong" ) 
    );
  }


/*
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
*/
  public navigatePage(anchor: string) {
    // Scroll the main view at the anchor position
    this.scroll.scrollToElement(anchor);
  }
}
