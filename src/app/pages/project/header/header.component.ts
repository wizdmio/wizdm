import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ContentService, ProjectService, Project, wmUser } from 'app/core';
import { $animations } from './header-animations';

import * as moment from 'moment';

@Component({
  selector: 'wm-project-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: $animations
})
export class HeaderComponent implements OnInit {

  public msgs;
  public favorite = false;
  public notifications = false;

  constructor(private content:  ContentService) { 
    
    // Initialize the localized content
    this.msgs = this.content.select('project.header');
  }

  ngOnInit() {}

  @Input('project') project: Project;

  @HostBinding('style.background-image') get urlCoverImage(): string{
    return !!this.project && !!this.project.data.cover ? `url(${this.project.data.cover})` : '';
  }

  @HostBinding('@cover') get cover() {
    return !!this.project && !!this.project.data.cover;
  }

  public modifiedOn(project: Project): string {
    const timestamp = project.data.updated || project.data.created;
    return moment(timestamp ? timestamp.toMillis() : undefined).format('lll');
  }

  public toggleFavorite(): void {
    this.favorite != this.favorite;
  }

}
