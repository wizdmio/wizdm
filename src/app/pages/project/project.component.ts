import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContentService, AuthService, ProjectService, wmProject } from 'app/core';
import { ToolbarService, ActionEnabler } from 'app/navigator';
import { PopupService } from 'app/shared';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

const $debug = "# Test with a [link](../../profile)\nFollowed by a simple paragraph _with_ **emphasis** and ~~corrections~~ and a note[^note]\n\n [^note]: this is a note"

@Component({
  selector: 'wm-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  //private sub: Subscription;
  public project: wmProject;
  public msgs;

  constructor(private content  : ContentService,
              //private auth    : AuthService,
              private database : ProjectService,
              private route    : ActivatedRoute,
              private toolbar  : ToolbarService,
              private popup    : PopupService) { }

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('project');

    // Load the project contents and keep them in sync
    this.syncProject().subscribe( project => {

      let type = this.database.isProjectMine(project) ? 'owner' : 'guest';

      // Enable actions on the navigation bar depending on the 
      // type of user (owner or guest)
      this.toolbar.activateActions(this.msgs.actions[type])
        .subscribe( code => this.doAction(code) );
    });
  }

  public get document() {
    return this.project ? this.project.document : {};
  }

  private syncProject(): Observable<wmProject> {

    return this.route.paramMap.pipe(
      switchMap( param => 
        this.database.queryProject( param.get('id') )
      ),
      catchError( error => 
        of({ document: $debug } as wmProject) 
      ),
      tap( project => {
        this.project = project || { document: $debug } as wmProject;
      }
    ));
  }

  private doAction(code: string){

    switch(code) {

      case 'delete':

      // Ask for confirmation prior to delete the project
      this.popup.confirmPopup(this.msgs.canDelete)
        .subscribe( () => {
          this.database.deleteProject( this.project.id );
        });

      break;
    }
  }

}
