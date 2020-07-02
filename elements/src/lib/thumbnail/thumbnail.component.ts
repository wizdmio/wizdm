import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'

export type ThumbnailSize = 'xs'|'sm'|'md'|'lg';

@Component({
  selector: 'wm-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  host: { 'class': 'wm-thumbnail' },
  encapsulation: ViewEncapsulation.None
})
export class ThumbnailComponent {

  /** Image source */
  @Input() src: string;

  /** Optional image name */
  @Input() name: string;

  // Size customization 
  @HostBinding('attr.size')
  @Input() size: ThumbnailSize = 'sm';

  // Color customization 
  @HostBinding('attr.color')
  @Input() color: ThemePalette = 'accent';

  @Input('selected') set selecting(value: boolean) { this.selected = coerceBooleanProperty(value); }
  @HostBinding('attr.selected')
  public selected = false;
}