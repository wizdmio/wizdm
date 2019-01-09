import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ContentManager } from '@wizdm/content';
import { Project } from '../../../core';

import * as moment from 'moment';

@Component({
  selector: 'wm-project-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public msgs;
  public favorite = false;
  public notifications = false;

  constructor(private content:  ContentManager) { 
    
    // Initialize the localized content
    this.msgs = this.content.select('project.header');
  }

  ngOnInit() {}

  @Input('project') project: Project;

  public modifiedOn(project: Project): string {
    const timestamp = project.data.updated || project.data.created;
    return moment(timestamp ? timestamp.toMillis() : undefined).format('lll');
  }

  public toggleFavorite(): void {
    this.favorite != this.favorite;
  }

}
