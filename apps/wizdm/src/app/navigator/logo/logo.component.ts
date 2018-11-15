import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { ContentManager } from '@wizdm/content';
import { $animations } from './logo.animations';

@Component({
  selector: 'wm-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  animations: $animations
})
export class LogoComponent {

  public loading = false;
 
  constructor() { }

  @Input() caption: string = "wizdm";

  /*
  @HostBinding('@blink') blink = false;
  @HostListener('@blink.done') loop() {
    if(this.loading) { this.blink = !this.blink; }
  }
  
  @Input('loading') enableLoading(loading: boolean) {
    if(this.loading = loading) {
      this.loop();
    }
  }
  */
}
