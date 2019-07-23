import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
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

  @Input() src: string;

  @Input() name: string;

  // Size customization 
  @HostBinding('attr.size')
  @Input() size: ThumbnailSize = 'sm';

  // Color customization 
  @HostBinding('attr.color')
  @Input() color: ThemePalette = 'accent';

  @HostBinding('attr.selected')
  @Input() selected: boolean;
}