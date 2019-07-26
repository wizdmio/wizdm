import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'
import { HttpClient } from '@angular/common/http';
import { $animations } from './illustration.animations';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'wm-illustration',
  templateUrl: './illustration.component.html',
  styleUrls: [ './illustration.component.scss' ],
  host: { 'class': 'wm-illustration' },
  encapsulation: ViewEncapsulation.None,
  animations: $animations
  
})
export class IllustrationComponent {

  public svg: SafeHtml;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  @HostBinding('attr.color')
  @Input() color: ThemePalette;

  @Input('disableAnimations') set disableAnimation(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  @HostBinding('@.disabled') 
  public disabled = false;

  @Input() set src(src: string) {

    this.http.get(src, { responseType: 'text'} )
      .pipe( catchError( e => ( this.error.emit(e), of('') ) ))
      .subscribe(svg => {

        this.svg = this.sanitizer.bypassSecurityTrustHtml(svg);

        this.load.emit();
    });
  }

  @Output() load = new EventEmitter<void>();

  @Output() error = new EventEmitter<Error>();
}