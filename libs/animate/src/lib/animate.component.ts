import { Component, OnInit, OnDestroy, Optional, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef, NgZone } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { $animations } from './animate.animations';
import { Subject, Observable, of, OperatorFunction} from 'rxjs';
import { map, startWith, distinctUntilChanged, delay, first, scan, takeUntil, takeWhile, switchMap } from 'rxjs/operators';
import { AnimateService } from './animate.service';

export type wmAnimations = 'landing'|'pulse'|'beat'|'heartBeat'|'fadeIn'|'fadeInRight'|'fadeInLeft'|'fadeInUp'|'fadeInDown'|'zoomIn'|'bumpIn'|'fadeOut'|'fadeOutRight'|'fadeOutLeft'|'fadeOutDown'|'fadeOutUp'|'zoomOut';
export type wmAnimateSpeed = 'slower'|'slow'|'normal'|'fast'|'faster';

/** Returns an observable mirroring the source while running within the given zone */
export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return source => {
    return new Observable( observer => {
      return source.subscribe(
        (value: T) => zone.run(() => observer.next(value)),
        (e: any) => zone.run(() => observer.error(e)),
        () => zone.run(() => observer.complete())
      );
    });
  };
}

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

  constructor(private elm: ElementRef, private scroll: ScrollDispatcher, private zone: NgZone, private view: AnimateService) {}

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

    // Waits until the zone is stable once, aka the render is complete so the element to measure is there 
    return this.zone.onStable.pipe( 
      // Waits just once
      first(),
      // Triggers the play and replay requests
      switchMap( () => this.animateReplay() ),
      // Triggers the while scrolling
      switchMap( trigger => this.aos ? this.animateOnScroll(elm) : of(trigger) ) 
    );
  }

  // Triggers the animation deferred
  private animateReplay(): Observable<boolean> {

    return this.replay$.pipe( 
      // Disposed on destroy
      takeUntil(this.dispose$), 
      // Waits the next roud to re-trigger
      delay(0), 
      // Triggers immediately when not paused
      startWith(!this.paused) 
    );
  }

  // Returns the element's visibility ratio Observable
  private get visibility(): Observable<number> { 
    return this.view.visibility( this.elm?.nativeElement ); 
  }

  // Triggers the animation on scroll
  private animateOnScroll(elm: ElementRef<HTMLElement>): Observable<boolean> {

    // Returns an AOS observable
    return this.scroll.ancestorScrolled(elm, 0).pipe(
      // Makes sure to dispose on destroy
      takeUntil(this.dispose$),
      // Makes sure triggering the start no matter there's no scroll event hits yet
      startWith(null),
      // Maps the scrolling to the element visibility value
      switchMap( () => this.visibility ),
      // Applies an hysteresys, so, to trigger the animation on based on the treshold while off on full invisibility
      scan((result, visiblility) => (visiblility >= this.threshold) || (result && visiblility > 0), false),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => !trigger || !this.once, true),
      // Runs within the angular zone to trigger change detection back on
      runInZone(this.zone)
    );
  }
}