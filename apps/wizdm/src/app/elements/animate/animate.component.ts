import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef, NgZone } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { $animations } from './animate.animations';
import { Subject, Observable, of } from 'rxjs';
import { map, startWith, distinctUntilChanged, delay, scan, takeUntil, takeWhile, switchMap } from 'rxjs/operators';

export type wmAnimations = 'landing'|'pulse'|'beat'|'heartBeat'|'fadeIn'|'fadeInRight'|'fadeInLeft'|'fadeInUp'|'fadeInDown'|'zoomIn'|'fadeOut'|'fadeOutRight'|'fadeOutLeft'|'fadeOutDown'|'fadeOutUp'|'zoomOut';
export type wmAnimateSpeed = 'slower'|'slow'|'normal'|'fast'|'faster';

@Component({
 selector: '[wmAnimate]',
 template: '<ng-content></ng-content>',
 animations: $animations
})
export class AnimateComponent implements OnInit, OnDestroy {

  private replay$ = new Subject<boolean>();
  private dispose$ = new Subject<void>();

  readonly timings = { slower: '3s', slow: '2s', normal: '1s', fast: '500ms', faster: '300ms' };

  constructor(private elm: ElementRef, private scroll: ScrollDispatcher, private zone: NgZone){}

  private get idle() { return { value: 'idle' }; }
  private get play() { 
    return { 
      value: this.animate,
      //delay: this.delay, 
      params: { 
        timing: this.timings[this.speed] || '1s' 
      }
    };
  }

  //@Input() delay: number|string;
 
  /** Selects the animation to be played */
  @Input('wmAnimate') animate: wmAnimations;

  /** Speeds up or slows down the animation */
  @Input() speed: wmAnimateSpeed = 'normal';

  @HostBinding('@animate')
  private trigger: string | {} = 'idle';

  /** Disables the animation */
  @Input('disabled') set disableAnimation(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  @HostBinding('@.disabled') 
  public disabled = false;

  /** Emits at the end of the animation */
  @Output() start = new EventEmitter<void>();  
  @HostListener('@animate.start') private animationStart() { this.start.emit(); }

  /** Emits at the end of the animation */
  @Output() done = new EventEmitter<void>();  
  @HostListener('@animate.done') private animationDone() { this.done.emit(); }

  /** When true, keeps the animation idle until the next replay triggers */
  @Input('paused') set pauseAnimation(value: boolean) { this.paused = coerceBooleanProperty(value); }
  public paused: boolean = false;

  /** When true, triggers the animation on element scrolling in the viewport */
  @Input('aos') set enableAOS(value: boolean) { this.aos = coerceBooleanProperty(value); }
  public aos: boolean = false;

  /** When true, triggers the animation on element scrolling in the viewport */
  @Input('once') set aosOnce(value: boolean) { this.once = coerceBooleanProperty(value); }
  public once: boolean = false;

    /** Specifies the amount of visibility triggering AOS */
  @Input() threshold: number = 0.2;
  
  /** Replays the animation */
  @Input() set replay(replay: any) {

    // Skips whenever the animation never triggered   
    if(this.trigger === 'idle') { return; }

    // Re-triggers the animation again on request
    if(coerceBooleanProperty(replay)) {
      
      this.trigger = this.idle;
      this.replay$.next(true);
    }
  }

  ngOnInit() { 
    // Triggers the animation based on the input flags
    this.animateTrigger().subscribe( trigger => {
      // Triggers the animation to play or to idle
      this.trigger = trigger ? this.play : this.idle;
    });
  }

  ngOnDestroy() { this.dispose(); }

  private dispose() {
    this.dispose$.next(); 
    this.dispose$.complete();
  }

  // Triggers the animation
  private animateTrigger(): Observable<boolean> {

    return this.animateReplay().pipe( switchMap( trigger => this.aos ? this.animateOnScroll() : of(trigger)) );
  }

  // Triggers the animation deferred
  private animateReplay(): Observable<boolean> {

    return this.replay$.pipe( takeUntil(this.dispose$), delay(0), startWith(!this.paused) );
  }

  // Triggers the animation on scroll
  private animateOnScroll(): Observable<boolean> {

    // Return an AOS observable
    return new Observable<boolean>( observer => {
      // Ask for a scroll observable from angular cdk/ScrollDispatcher with throttle
      // NOTE: ScrollDispatcher observables run out of NgZone, so, make sure to use NgZone.run() when needed
      this.scroll.ancestorScrolled(this.elm, 100).pipe(
        // Makes sure to dispose on destroy
        takeUntil(this.dispose$),
        // Starts with initial element visibility 
        startWith( !this.paused  && this.visibility >= this.threshold ),
        // Maps the scrolling to the element visibility value
        map( () => this.visibility  ),
        // Applies an hysteresys, so, to trigger the animation on based on the treshold while off on full invisibility
        scan<number, boolean>((result, visiblility) => (visiblility >= this.threshold || (result ? visiblility > 0 : false))),
        // Distincts the resulting triggers 
        distinctUntilChanged(),
        // Stop taking the first on trigger when aosOnce is set
        takeWhile(trigger => !trigger || !this.once, true)
        // Run NEXT within the angular zone to trigger change detection back on
      ).subscribe( trigger => this.zone.run(() => observer.next(trigger) ), null, () => observer.complete() );
    });
  }

  // Computes the element visibility ratio
  private get visibility(): number {

    // TODO: refactor to rely on the containing scroller rather than the window
    const r = this.clientRect(this.elm);
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Return 1.0 when the element is within the screen constraints
    if(r.left >= 0 && r.top  >= 0 && r.right < w && r.bottom < h) { return 1.0; }

    // Computes the intersection area otherwise
    const a = Math.round(r.width * r.height);
    const b = Math.max(0, Math.min(r.right, w) - Math.max(r.left, 0));
    const c = Math.max(0, Math.min(r.bottom, h) - Math.max(r.top, 0));

    // Returns the amount of visible area 
    return Math.round(b * c / a * 10) / 10;
  }

  // Element client bounding rect helper
  private clientRect(elm: ElementRef<HTMLElement>) {
    const el = !!elm && elm.nativeElement;
    return !!el && el.getBoundingClientRect();
  }
}