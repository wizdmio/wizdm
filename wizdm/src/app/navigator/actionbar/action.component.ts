import { Component, Input, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MediaObserver } from '@angular/flex-layout';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'wm-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {

  constructor(/*private actionbar: ActionbarDirective,*/ private media: MediaObserver) { }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs'); }

  /** The icon to be used on small screens */
  @Input() icon: string;
  
  /** The palette color */
  @Input() color: ThemePalette;

  /** Disables the action */
  @Input('disabled') set disableAction(value: any) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false;

  @HostBinding('style.pointer-events') get isActionDisabled(): string { 
    return this.disabled ? 'none' : undefined; 
  }
}
