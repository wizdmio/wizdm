import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ContentService, ProjectService, wmProject, wmUser } from 'app/core';
import { Observable } from 'rxjs';
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

  constructor(private content:  ContentService,
              private database: ProjectService) { 
    
    // Initialize the localized content
    this.msgs = this.content.select('project.header');
  }

  ngOnInit() {}

  public project: wmProject;
  public owner$: Observable<wmUser>;
  
  @Input('project') set setProject(project: wmProject) {
    this.owner$  = this.database.resolveOwner(project);
    this.project = project || {} as wmProject;
  }

  public get isMine() { return this.database.isProjectMine(this.project); }

  @HostBinding('style.background-image') get urlCoverImage(): string{
    return !!this.project && !!this.project.cover ? `url(${this.project.cover})` : '';
  }

  @HostBinding('@cover') get cover() {
    return !!this.project && !!this.project.cover;
  }

  public modifiedOn(project: wmProject): string {
    return project && project.updated ?
      moment((project.updated || project.created).toMillis()).format('lll') :
      '';
  }

  public toggleFavorite(): void {
    this.favorite != this.favorite;
  }

}
