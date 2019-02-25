import { Component, OnInit, HostBinding, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ContentManager } from '@wizdm/content';
import { wmFile } from '@wizdm/connect';
import { Project, wmProject  } from '../../../core';
import { wmColor, wmColorMap, COLOR_MAP } from '../../../elements';
import * as moment from 'moment';

@Component({
  selector: 'wm-explore-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ExploreItemComponent {

  public msgs;
  public favorite = false;
  public notifications = false;

  @Input() project: Project;

  constructor(private content: ContentManager) { 
    
    // Initialize the localized content
    this.msgs = this.content.select('explore.item');
  }
/*
  @HostBinding('style.background-image') get urlCoverImage(): string{
    return !!this.project && !!this.project.data.cover ? `url(${this.project.data.cover})` : '';
  }
*/

  public modifiedOn(project: Project): string {
    const timestamp = project.data.updated || project.data.created;
    return moment(timestamp ? timestamp.toMillis() : undefined).format('lll');
  }

  public toggleFavorite(): void {
    this.favorite != this.favorite;
  }

}
