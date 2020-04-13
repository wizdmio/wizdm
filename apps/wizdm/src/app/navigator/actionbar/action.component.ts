import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ThemePalette } from '@angular/material/core';
import { ActionbarDirective } from './actionbar.directive';

@Component({
  selector: 'wm-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {

  constructor(private actionbar: ActionbarDirective, private media: MediaObserver) { }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs'); }

  @Input() icon: string;
  
  @Input() color: ThemePalette;

  @Input() disabled: boolean;

  @Output() click = new EventEmitter<MouseEvent>();

  public onClick(event: MouseEvent) {

    this.click.emit(event);

    this.actionbar.activate(this);
  }
}
