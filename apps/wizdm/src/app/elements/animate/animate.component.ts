import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef } from '@angular/core';
import { $animations } from './animate.animations';
import { throttleTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

export type wmAnimations = 'landing'|'pulse'|'beat'|'heartBeat'|'fadeIn'|'fadeInRight'|'fadeInLeft'|'fadeInUp'|'fadeInDown'|'zoomIn'|'fadeOut'|'fadeOutRight'|'fadeOutLeft'|'fadeOutDown'|'fadeOutUp'|'zoomOut';
export type wmAnimateSpeed = 'slower'|'slow'|'normal'|'fast'|'faster';

@Component({
  selector: '[wmAnimate]',
  template: '<ng-content></ng-content>',
  animations: $animations
})
export class AnimateComponent implements OnInit {

  readonly timings = { slower: '3s', slow: '2s', normal: '1s', fast: '500ms', faster: '300ms' };
  private animate: wmAnimations;
  private trigger = 'idle';

  constructor(private el: ElementRef){
/*
    const observer = new IntersectionObserver( entries => { 

      const entry = entries.find( entry => entry.target === this.el.nativeElement);
      if(!!entry && entry.isIntersecting) {
        
        console.log('intersecting!');

        this.trigger = this.animate;
      }

    }, { threshold: 0 });

    observer.observe(el.nativeElement);*/
/*
    fromEvent(window, 'scroll')
      .pipe(throttleTime(99))
      .subscribe( () => this.ngOnInit() );
*/
  }

  @HostBinding('@.disabled')
  @Input() disable = false;

  @Input() speed: wmAnimateSpeed = 'normal';

  @HostBinding('@animate') get start() { //trigger = 'idle';
    return { 
      value: this.trigger,
      //delay: this.delay, 
      params: { 
        timing: this.timings[this.speed] || '1s' 
      }
    };
  }

  @Input() set wmAnimate(trigger: wmAnimations) { this.animate = trigger; }

  @Input() set replay(value: any) {

    // Skips the first round (no animation has been played yet)
    if(this.trigger === 'idle') { return; }

    // Re-triggers the animation again
    this.trigger = 'idle';
    setTimeout(() => { this.trigger = this.animate; } );
  }

  ngOnInit() {

    // Triggers the very firts animation
    this.trigger = this.animate;
    /*
    if( this.isElementInViewport(this.el.nativeElement) ){
      this.trigger = this.animate;
    }*/
  }

  @Output() done = new EventEmitter<void>();
  @HostListener('@animate.done') animationDone() { this.done.emit(); }
/*
  @HostListener('scroll', ['$event']) scroll() { this.ngOnInit(); }
  @HostListener('resize', ['$event']) resize() { this.ngOnInit(); }
  */
/*
  private isElementInViewport(el: HTMLElement) : boolean {

    const rect = el.getBoundingClientRect() as ClientRect;

    console.log(rect);

    if(this.offset > 0) {
      rect.left   += this.offset;
      rect.top    += this.offset;
      rect.right  -= this.offset;
      rect.bottom -= this.offset;
    }

    if(this.fullIn) {
      return (rect.left > 0 && rect.top > 0 && rect.right < window.screen.width && rect.bottom < window.screen.height);
    }

    return (rect.right > 0 && rect.bottom > 0 && rect.left < window.screen.width && rect.top < window.screen.height);
  }*/
}