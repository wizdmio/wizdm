import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { ContentService } from '../../../core';
import { $animations } from './logo.animations';

@Component({
  selector: 'wm-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  animations: $animations
})
export class LogoComponent implements OnInit {

  public loading = false;
  public logo: string;
  
  constructor(private content: ContentService) {
    this.logo = this.content.select("navigator.logo") as string;
  }

  ngOnInit() {}

  @HostBinding('@blink') blink = false;
  @HostListener('@blink.done') loop() {
    if(this.loading) { this.blink = !this.blink; }
  } 

  @Input('loading') enableLoading(loading: boolean) {
    if(this.loading = loading) {
      this.loop();
    }
  }
}
