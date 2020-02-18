import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef, NgZone } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { $animations } from './animate.animations';
import { Subject, Observable, of } from 'rxjs';
import { map, startWith, distinctUntilChanged, delay, scan, takeUntil, takeWhile, flatMap } from 'rxjs/operators';

export type wmAnimations = 'landing'|'pulse'|'beat'|'heartBeat'|'fadeIn'|'fadeInRight'|'fadeInLeft'|'fadeInUp'|'fadeInDown'|'zoomIn'|'bumpIn'|'fadeOut'|'fadeOutRight'|'fadeOutLeft'|'fadeOutDown'|'fadeOutUp'|'zoomOut';
export type wmAnimateSpeed = 'slower'|'slow'|'normal'|'fast'|'faster';

export class wmRect { 
  constructor(readonly left: number, readonly top: number, readonly right: number, readonly bottom: number) {}
  get width(): number { return this.right - this.left; }
  get height(): number { return this.bottom - this.top; } 
};

@Component({
 selector: '[wmAnimate]',
 template: '<ng-content></ng-content>',
 animations: $animations
})
export class AnimateComponent implements OnInit, OnDestroy {

  readonly timings = { slower: '3s', slow: '2s', normal: '1s', fast: '500ms', faster: '300ms' };
  private  replay$ = new Subject<boolean>();
  private  dispose$ = new Subject<void>();
  
  // Animating properties
  public animating = false;
  public animated = false;

  constructor(private elm: ElementRef, private scroll: ScrollDispatcher, private zone: NgZone) {}

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
  @HostListener('@animate.start') 
  private animationStart() { this.animating = true; this.animated = false; this.start.emit(); }

  /** Emits at the end of the animation */
  @Output() done = new EventEmitter<void>();  
  @HostListener('@animate.done') 
  private animationDone() { this.animating = false; this.animated = true; this.done.emit(); }

  /** When true, keeps the animation idle until the next replay triggers */
  @Input('paused') set pauseAnimation(value: boolean) { this.paused = coerceBooleanProperty(value); }
  public paused: boolean = false;

  /** When true, triggers the animation on element scrolling in the viewport */
  @Input('aos') set enableAOS(value: boolean) { this.aos = coerceBooleanProperty(value); }
  public aos: boolean = false;

  /** When true, triggers the animation on element scrolling in the viewport */
  @Input('once') set aosOnce(value: boolean) { this.once = coerceBooleanProperty(value); }
  public once: boolean = false;

    /** Specifies the amout of visibility triggering AOS */
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
    this.animateTrigger(this.elm).subscribe( trigger => {
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
  private animateTrigger(elm: ElementRef<HTMLElement>): Observable<boolean> {

    return this.animateReplay().pipe( delay(0), flatMap( trigger => this.aos ? this.animateOnScroll(elm) : of(trigger)) );
  }

  // Triggers the animation deferred
  private animateReplay(): Observable<boolean> {

    return this.replay$.pipe( takeUntil(this.dispose$), delay(0), startWith(!this.paused) );
  }

  // Triggers the animation on scroll
  private animateOnScroll(elm: ElementRef<HTMLElement>): Observable<boolean> {

    // Returns an AOS observable
    return this.scroll.ancestorScrolled(elm, 100).pipe(
      // Makes sure to dispose on destroy
      takeUntil(this.dispose$),
      // Starts with initial element visibility 
      startWith(!this.paused && (this.visibility >= this.threshold)),
      // Maps the scrolling to the element visibility value
      map(() => this.visibility),
      // Applies an hysteresys, so, to trigger the animation on based on the treshold while off on full invisibility
      scan((result, visiblility) => (visiblility >= this.threshold) || (result && visiblility > 0), false),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => !trigger || !this.once, true),
      // Run NEXT within the angular zone to trigger change detection back on
      flatMap(trigger => new Observable<boolean>(observer => this.zone.run(() => observer.next(trigger))))
    );
  }

  // Computes the element's visibility ratio
  private get visibility(): number {

    // Gets the element's bounding rect
    const rect = this.elm && this.elm.nativeElement && this.elm.nativeElement.getBoundingClientRect();
    if(!rect) { return 0; }

    // Return 1.0 when the element is fully within the viewport
    if(rect.left >= 0 && rect.top >= 0 && rect.right < window.innerWidth + 1 && rect.bottom < window.innerHeight + 1) { 
      return 1; 
    }

    // Computes the intersection area otherwise
    const a = Math.round(rect.width * rect.height);
    const b = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left,0));
    const c = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));

    // Returns the amount of visible area 
    return Math.round(b * c / a * 10) / 10;
  }
}