import { Directive, Input, HostBinding, OnDestroy } from '@angular/core';
//import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { LazyImageLoader } from './lazy-image.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'img[lazyLoad]'
})
export class LazyLoadDirective implements OnDestroy {

  private sub: Subscription;

  constructor(private loader: LazyImageLoader) { }

  @HostBinding() src: string;

  @HostBinding() width: number;

  @HostBinding() height: number;

  @Input() keepAspectRatio: boolean;

  @Input() set lazyLoad(source: string) {

    if(this.sub) { this.sub.unsubscribe(); this.sub = undefined; }

    this.sub = this.loader.load(source).subscribe( payload => {

      this.width  = payload?.width;
      this.height = payload?.height;
      this.src    = payload?.source;

    })
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}
