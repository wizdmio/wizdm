import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContentService, ProjectService, wmProject } from 'app/core';
import { ToolbarService, ActionEnabler } from 'app/navigator';
import { PopupService } from 'app/shared';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, catchError, tap, take } from 'rxjs/operators';
import { $animations } from './project.animations';

const $debug = "# Test with a [link](../../profile)\nFollowed by a simple paragraph _with_ **emphasis** and ~~corrections~~ and a note[^note]\n\n [^note]: this is a note"

@Component({
  selector: 'wm-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: $animations
})
export class ProjectComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  public project: wmProject;
  public msgs;

  public editMode = false;

  constructor(private content  : ContentService,
              private database : ProjectService,
              private route    : ActivatedRoute,
              private toolbar  : ToolbarService,
              private popup    : PopupService) { }

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('project');
    
    // Load the project once first...
    this.syncProject().pipe( take(1) ).subscribe( project => {

      let type = this.database.isProjectMine(project) ? 'owner' : 'guest';

      // Enable actions on the navigation bar depending on the 
      // type of user (owner or guest)
      this.toolbar.activateActions(this.msgs.actions[type])
        .subscribe( code => this.doAction(code) );
    });

    // ...then keep the project in sync
    this.sub = this.syncProject().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public get document(): string {
    return this.project ? this.project.document : "";
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

      case 'edit':
      this.editMode = true;
      break;

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
