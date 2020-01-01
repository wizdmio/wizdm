import { Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
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

  @Input('inline') set inlining(value: boolean) { this.inline = coerceBooleanProperty(value); }
  public inline: boolean = false;

  @Input() color: ThemePalette;

  @Input('icon') set setIcon(descriptor: string) {
   
    const segments = descriptor ? descriptor.split(':') : [];
    
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