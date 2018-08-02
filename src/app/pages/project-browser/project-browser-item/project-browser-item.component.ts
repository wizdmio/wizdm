import { Component, OnInit, Input } from '@angular/core';
import { ContentService, ProjectService, wmProject, Timestamp } from '../../../core';
import { PopupService } from '../../../shared';
//import * as moment from 'moment';

@Component({
  selector: 'wm-project-browser-item',
  templateUrl: './project-browser-item.component.html',
  styleUrls: ['./project-browser-item.component.scss']
})
export class ProjectBrowserItemComponent implements OnInit {

  @Input('project') project: wmProject;

  public msgs: any;
  public favorite = false;
  private progress = 0;

  public areas = [
    { icon: 'fas:fa-lightbulb', label: 'Idea' },
    { icon: 'fas:fa-code',      label: 'Development' },
    { icon: 'fas:fa-palette',   label: 'Design' },
    { icon: 'fas:fa-font',      label: 'Content' },
    { icon: 'fas:fa-gavel',     label: 'Legal' },
  ];

  public completion = 75;

  constructor(private content  : ContentService,
              private database : ProjectService,
              private popup    : PopupService) { }

  ngOnInit() {
    
    // Gets the localized content
    this.msgs = this.content.select('project');
  }

  // Internal timestamp conversion helpers
  //private tsToNumber(ts: Timestamp) { return ts ? ts.toMillis() : 0;}
  //private tsToDate(ts: Timestamp) { return ts ? ts.toDate() : new Date(null);}
  //private tsToMoment(ts: Timestamp): moment.Moment { return ts ? moment( ts.toDate() ) : moment();}

  public get isMine() { return this.database.isProjectMine(this.project); }

  public get projectImage(): string {
    return 'assets/img/wmlogo.svg';
  }

  public toggleFavorite() {
    this.favorite = !this.favorite;
  }

  public editProject() {

  }

  public deleteProject() {

    this.popup.popupDialog(this.msgs.canDelete)
      .then( proceed => {

        if(proceed) {

          let id = this.project.id;
          this.database.deleteProject(id);
        }
      });
  }
}
