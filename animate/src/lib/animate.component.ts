import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { startWith, map, takeWhile, delay, distinctUntilChanged } from 'rxjs/operators';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Subject, Subscription } from 'rxjs';
import { trigger } from '@angular/animations';
import { AnimateService } from './animate.service';
// Animations
import { beat, bounce, headShake, heartBeat, pulse, rubberBand, shake, swing, wobble, jello, tada, flip } from './attention-seekers';
import { bumpIn, bounceIn, fadeIn, flipIn, jackInTheBox, landing, rollIn, zoomIn } from './entrances';
import { bounceOut, fadeOut, hinge, rollOut, zoomOut } from './exits';
import { state, style } from '@angular/animations';

export type wmAnimateSpeed = 'slower'|'slow'|'normal'|'fast'|'faster';
export type wmAnimations = 
  // Attention seekers
  'beat'|'bounce'|'flip'|'headShake'|'heartBeat'|'jello'|'pulse'|'rubberBand'|'shake'|'swing'|'tada'|'wobble'|
  // Entrances
  'bumpIn'|'bounceIn'|'bounceInDown'|'bounceInLeft'|'bounceInUp'|'bounceInRight'|'fadeIn'|'fadeInRight'|'fadeInLeft'|'fadeInUp'|'fadeInDown'|'flipInX'|'flipInY'|'jackInTheBox'|'landing'|'rollIn'|'zoomIn'|'zoomInDown'|'zoomInLeft'|'zoomInUp'|'zoomInRight'|
  // Exits
  'bounceOut'|'bounceOutDown'|'bounceOutUp'|'bounceOutRight'|'bounceOutLeft'|'fadeOut'|'fadeOutRight'|'fadeOutLeft'|'fadeOutDown'|'fadeOutUp'|'hinge'|'rollOut'|'zoomOut'|'zoomOutDown'|'zoomOutRight'|'zoomOutUp'|'zoomOutLeft'|
  // None
  'none';

@Component({
  selector: '[wmAnimate]',
  template: '<ng-content></ng-content>',
  animations: [ trigger('animate', [
    // Attention seekers
    ...beat,...bounce,...flip,...headShake,...heartBeat,...jello,...pulse,...rubberBand,...shake,...swing,...tada,...wobble,
    // Entrances
    ...bumpIn,...bounceIn,...fadeIn,...flipIn,...jackInTheBox,...landing,...rollIn,...zoomIn,
    // Exits
    ...bounceOut,...fadeOut,...hinge,...rollOut,...zoomOut,
    // None
    state('none', style('*')), state('idle-none', style('*'))
  ])]
})
export class AnimateComponent implements OnInit, OnDestroy {

  private replay$ = new Subject<boolean>();
  private sub: Subscription;

  // Animating parameters
  private timing: string;
  private delay: string;
  
  // Animating properties
  public animating = false;
  public animated = false;

  constructor(private elm: ElementRef, private scroll: AnimateService, private renderer: Renderer2) {}

  @HostBinding('@animate') 
  public trigger;

  private get idle() { return { value: `idle-${this.animate}` }; }
  private get play() {

    const params = {}; 
    // Builds the params object, so, leaving to the default values when undefined
    if(!!this.timing) { params['timing'] = this.timing; }
    if(!!this.delay) { params['delay'] = this.delay; }  
    
    return { value: this.animate, params };
  }

  /** Selects the animation to be played */
  @Input('wmAnimate') animate: wmAnimations;

  /** Speeds up or slows down the animation */
  @Input() set speed(speed: wmAnimateSpeed) {
    // Turns the requested speed into a valid timing
    this.timing = { 
      slower: '3s', 
      slow: '2s', 
      normal: '1s', 
      fast: '500ms', 
      faster: '300ms' 
    }[speed || 'normal'] || '1s';
  }

  /** Delays the animation */
  @Input('delay') set postpone(delay: string) {
    // Coerces the input into a number first
    const value = coerceNumberProperty(delay, 0);
    if(value) { 
      // Turns a valid number into a ms delay
      this.delay = `${value}ms`;
    }
    else {
      // Test the string for a valid delay combination
      this.delay = /^\d+(?:ms|s)$/.test(delay) ? delay : '';
    }
  }

  /** Disables the animation */
  @Input('disabled') set disableAnimation(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  @HostBinding('@.disabled') 
  public disabled = false;

  /** Emits at the end of the animation */
  @Output() start = new EventEmitter<void>();  
  @HostListener('@animate.start') 
  public animationStart() { this.animating = true; this.animated = false; this.start.emit(); }

  /** Emits at the end of the animation */
  @Output() done = new EventEmitter<void>();  
  @HostListener('@animate.done') 
  public animationDone() { 
    
    this.animating = false; this.animated = true; this.done.emit(); 

    /** 
     * Removes spurious 'animation' style from the element once done with the animation. 
     * This behaviour has been observed when running on iOS devices where for some reason 
     * the animation engine do not properly clean-up the animation style using cubic-bezier()
     * as its timing function. The issue do not appear with ease-in/out and others.
     * */
    this.renderer.removeStyle(this.elm.nativeElement, 'animation');
  }

  /** When true, keeps the animation idle until the next replay triggers */
  @Input('paused') set pauseAnimation(value: boolean) { this.paused = coerceBooleanProperty(value); }
  public paused: boolean = false;

  /** When defined, triggers the animation on element scrolling in the viewport by the specified amount. Amount defaults to 50% when not specified */
  @Input('aos') set enableAOS(value: number) { this.threshold = coerceNumberProperty(value, 0.5); }
  private threshold: number = 0;

  /** When true, triggers the animation on element scrolling in the viewport */
  @Input('once') set aosOnce(value: boolean) { this.once = coerceBooleanProperty(value); }
  public once: boolean = false;

  /** Replays the animation */
  @Input() set replay(replay: any) {

    // Re-triggers the animation again on request (skipping the very fist value)
    if(!!this.trigger && coerceBooleanProperty(replay)) {
      
      this.trigger = this.idle;
      this.replay$.next(true);
    }
  }

  ngOnInit() {

    // Triggers the animation based on the input flags
    this.sub = this.replay$.pipe( 
      
      // Waits the next round to re-trigger
      delay(0), 
      
      // Triggers immediately when not paused
      startWith(!this.paused),
      
      // Builds the AOS observable from the common service
      this.scroll.trigger(this.elm, this.threshold),      
      
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => !trigger || !this.once, true),

      // Maps the trigger into animation states
      map( trigger => trigger ? this.play : this.idle ),

      // Always start with idle
      startWith(this.idle),

      // Eliminates multiple triggers
      distinctUntilChanged(),

      // Triggers the animation to play or to idle
    ).subscribe( trigger => this.trigger = trigger );
  }

  // Disposes of the observable
  ngOnDestroy() { this.sub.unsubscribe(); }
}