import { Directive, Inject, OnInit, OnDestroy, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentConfigurator } from '../loader/content-configurator.service';
import { ContentStreamer } from './content-streamer.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[wmContent]'
})
/** Provides the selected content to be consumed by the template */
export class ContentDirective extends ContentStreamer implements OnInit, OnDestroy {

  private sub: Subscription;
  public $implicit: any = {};

  constructor(route: ActivatedRoute, config: ContentConfigurator, private tpl: TemplateRef<ContentDirective>, private vcr: ViewContainerRef) {
    super(route, config)
  }

  ngOnInit() {
    // Creates the view using the directive body as the context
    this.vcr.createEmbeddedView(this.tpl, this);
  }

  ngOnDestroy() { 
    // Disposes the obsevable(s)
    if(!!this.sub) { this.sub.unsubscribe(); }
  }

  /** Binds the requested content as an observable:
   * Usage: 
   * <... *wmContent="let data$ observe 'content.page1'">
   *   ...
   *   <... *ngIf="data$ | async as data">
   *     ...
   *     <span>{{ data.title }}</span>
   */
  @Input() set wmContentObserve(selector: string) {
    // Skips on null selectors
    if(!selector) { return; }
    // Binds the data stream observable 
    this.$implicit = this.stream(selector);
  }

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
    this.sub = this.stream(selector)
      // Binds the data content
      .subscribe( data => this.$implicit = data );
  }
}