import { Component, OnInit, Input } from '@angular/core';
import { ContentService, ProjectService, wmProject } from 'app/core';
import { MatExpansionPanel } from '@angular/material';
import { Observable } from 'rxjs';

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

  constructor(private content:  ContentService,
              private database: ProjectService) { 
    
    // Initialize the localized content
    this.msgs = this.content.select('project.header');
  }

  ngOnInit() {}

  @Input() project: wmProject;

  public get isMine() { return this.database.isProjectMine(this.project); }

  public createdOn(project: wmProject): string {
    return project && project.created ?
      moment(project.created.toDate()).format('lll') :
      '';
  }

  public modifiedOn(project: wmProject): string {
    return project && project.updated ?
      moment(project.updated.toDate()).format('lll') :
      '';
  }

  public messages = [
    { from: { name: "Lucio" }, subject: "Join wizdm.io team", content: "Hi, your project sounds amazing. I'd love being a part of it." },
    { from: { name: "Alena" }, subject: "Come to Veganizer.app", content: "Hello, I believe you may be interested in joining Veganizer.app." },
    { from: { name: "Ita"   }, subject: "Need advice", content: "Hi, I'm planning to sunmit a project myself, can you help?" }
    
  ];

  public toggleNotifications(panel: MatExpansionPanel): void {

    this.notifications != this.notifications;
    panel.toggle();

  }

  public toggleFavorite(): void {
    this.favorite != this.favorite;
  }

}
