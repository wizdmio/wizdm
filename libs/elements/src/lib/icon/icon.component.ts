import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
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

  /** Theme color palette */
  @Input() color: ThemePalette;

  /** Inlines the icon automatically sizing it to match the font size */
  public inline: boolean = false;
  @Input('inline') set inlining(value: boolean) { this.inline = coerceBooleanProperty(value); }
  
  /** Enables extended material icons */
  public extended: boolean = false;
  @Input('extended') set extending(value: boolean) { this.extended = coerceBooleanProperty(value); }
  
  /** Icon name */
  @Input('icon') set setIcon(descriptor: string) {
   
    // Splits the descriptor between set:name
    const segments = descriptor ? descriptor.split(':') : [];
    
    if(segments.length > 1) {
      
      this.matIcon  = undefined;
      this.fontSet  = segments[0];
      this.fontIcon = segments[1];
    }
    else {

      this.matIcon = segments[0];
      this.fontSet = this.fontIcon = undefined;
    }
  }
}