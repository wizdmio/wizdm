import { Component, Input } from '@angular/core';
import { FabOptions } from '../fab.directive';

enum FabPositions { leftTop = 0, rightTop = 1, leftBottom = 2, rightBottom = 3 };

@Component({
  selector: 'wm-fab-portal',
  templateUrl: './fab-portal.component.html',
  styleUrls: ['./fab-portal.component.scss'],
  host: { 
    'class': 'wm-fab-portal',
    '[style.display]': 'active ? undefined : "none"'
  }
})
export class FabPortalComponent {

  readonly fabPos = FabPositions;

  readonly config: FabOptions[] = [];
  
  readonly tmpl: any[] = [];

  get active(): boolean { return this.tmpl.some( value => !!value ); }

  @Input() mobile: boolean = false;
}
