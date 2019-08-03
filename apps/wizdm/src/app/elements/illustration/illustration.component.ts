import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ThemePalette } from '@angular/material/core'
import { $animations } from './illustration.animations';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';

@Component({
  selector: 'wm-illustration',
  templateUrl: './illustration.component.html',
  styleUrls: ['./illustration.component.scss'],
  host: { 'class': 'wm-illustration' },
  encapsulation: ViewEncapsulation.None,
  animations: $animations
  
})
export class IllustrationComponent {

  public svg$: Observable<SafeHtml>;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private location: Location) { 

     // Builds the svg observable
    this.svg$ = combineLatest(
      // Resolves the svg content from the pushed source
      this.source$.pipe( 
        // Gets the svg file
        switchMap( src => this.http.get(src, { responseType: 'text'} ) ),
        // Emits the error event on loading error
        catchError( e => ( this.error.emit(e), of('') ) )
      ),
      // Combines with the pushed baseHref
      this.baseHref$

    ).pipe(
      // Applies the baseHref to url() properties on request 
      map(([svg, base]) => this.parseUrls(svg, base) ),
       // Sanitizes the result to bybass Angular security filters
      map( svg => this.sanitizer.bypassSecurityTrustHtml(svg) ),
      // Emits the load event when done
      tap( () => this.load.emit() )
    );
  }

  // Parses the url('#someLink') properties to prepend the baseHref when specified.
  // This is likely needed when using svg gradients/filters, and so on, since angular 
  // app most likely defines <base href="..."> tag in index.html breaking relative url()
  // resolution for SVGs in Firefox and Safari (works fine in Chrome, btw) 
  private parseUrls(svg: string, base: string): string {

    return !!base ? svg.replace(/url\([ '"]*(#.+)[ '"]*\)/g, (match, hash) => 
      match.replace(hash, this.location.normalize(base) + hash)
    ) : svg;
  }

  /** Source path of of the SVG to load */
  @Input() set src(src: string) { this.source$.next(src); }
  private source$ = new BehaviorSubject<string>('');

  /** Optional baseHref to prepend url('#someLink') tags with*/
  @Input() set baseHref(base: string) { this.baseHref$.next(base); }
  private baseHref$ = new BehaviorSubject<string>('');

  @HostBinding('attr.color')
  @Input() color: ThemePalette;

  @HostBinding('@.disabled')
  @Input() disableAnimations = false;

  @Output() load = new EventEmitter<void>();
  @Output() error = new EventEmitter<Error>();
}