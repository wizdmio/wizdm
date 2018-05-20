import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { ContentManager } from 'app/content';
import { logoAnimations } from './logo-animations';

@Component({
  selector: 'ut-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  animations: logoAnimations
})
export class LogoComponent implements OnInit {

  @Input('color') color = '#F1F1F1';

  @HostBinding('@color') get trigger() {
    return { value: this.color, params: { color: this.color } }; }

  @HostBinding('@logo') entrance = true;

/*  No need of this hack any longer since v4.3.4 where state's parameters has been implemented
  @HostListener('@color.done', ['$event']) onColorDone(event) {

    // Set the final color at the end of the animation
    // since we can't use a state() with a custom color
    // as a parameter 
    event.element.style.color = this.color;
  }
*/
  private logo: string;

  constructor(private content: ContentManager) { }

  ngOnInit() {
    this.logo = this.content.select("navigator.logo") as string;
  }
}
