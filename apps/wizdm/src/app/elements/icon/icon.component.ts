import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  host: { class: 'wm-icon' },
  encapsulation: ViewEncapsulation.None
})
export class IconComponent {

  public fontSet: string;
  public fontIcon: string;
  public matIcon = "code";

  @Input() inline: boolean;

  @Input() color: ThemePalette;

  @Input('icon') set setIcon(descriptor: string) {
   
    let segments = descriptor ? descriptor.split(':') : [];
    
    if(segments.length > 1) {
      
      this.matIcon  = undefined;
      this.fontSet  = segments[0];
      this.fontIcon = segments[1];
    }
    else {
      
      this.fontSet = this.fontIcon = undefined;
      this.matIcon = segments[0];
    }
  }
}
