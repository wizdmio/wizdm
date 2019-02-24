import { Component, Input } from '@angular/core';

@Component({
  selector: 'wm-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  
})
export class IconComponent {

  public fontSet: string  = undefined;
  public fontIcon: string = undefined;
  public matIcon = "code";

  constructor() { }

  @Input() color: string = undefined;
  @Input() inline: boolean = undefined;

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
