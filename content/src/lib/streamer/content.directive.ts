import { Directive, OnInit, OnDestroy, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ContentStreamer } from './content-streamer.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'ng-template[wmContent]'
})
/** Provides the selected content to be consumed by the template */
export class ContentDirective implements OnInit, OnDestroy {

  private sub: Subscription;
  public $implicit: any = [];

  constructor(private content: ContentStreamer, private tpl: TemplateRef<ContentDirective>, private vcr: ViewContainerRef) { }

  ngOnInit() {
    // Creates the view using the directive body as the context
    this.vcr.createEmbeddedView(this.tpl, this);
  }

  ngOnDestroy() { 
    // Disposes the obsevable(s)
    if(!!this.sub) { this.sub.unsubscribe(); }
  }

  /** The current resolved language code */
  get language(): string { return this.content.language; }

  /** Defines the default value to use whenever the requested content were missing */
  @Input() wmContentOr: any = [];

  /** Binds the requested content as an object directly:
   * Usage: 
   * <... *wmContent="let data select 'content.page1'">
   *   ...
   *   <span>{{ data.title }}</span>
   */
  @Input() set wmContentSelect(selector: string) {
    // Unsubscribes previous subscriptions
    if(!!this.sub) { this.sub.unsubscribe(); }
    // Skips on null selectors
    if(!selector) { return; }
    // Subscribes to the data stream
    this.sub = this.content.stream(selector)
      // Binds the data content
      .subscribe( data => this.$implicit = data || this.wmContentOr );
  }

  /** Binds the requested content as an observable:
   * Usage: 
   * <... *wmContent="let data$ stream 'content.page1'">
   *   ...
   *   <... *ngIf="data$ | async as data">
   *     ...
   *     <span>{{ data.title }}</span>
   */
  @Input() set wmContentStream(selector: string) {
    // Skips on null selectors
    if(!selector) { return; }
    // Binds the data stream observable 
    this.$implicit = this.content.stream(selector)
      .pipe( map( value => value || this.wmContentOr ));
  }
}