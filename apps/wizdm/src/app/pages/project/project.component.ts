import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentManager } from '@wizdm/content';
import { ProjectService, Project, wmProject } from '../../core';
import { ToolbarService, ActionEnabler } from '../../navigator';
import { wmDocument } from '../../document/common/editable-types';
import { PopupService } from '../../elements';
import { Observable, Subject, of, empty } from 'rxjs';
import { switchMap, catchError, tap, take, map, filter, debounceTime, takeUntil } from 'rxjs/operators';
import { $animations } from './project.animations';

import { $document } from './debug-document';

@Component({
  selector: 'wm-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: $animations
})
export class ProjectComponent implements OnInit, OnDestroy {

  public  project: Project;
  public  editMode = false;
  public  saved = true;
  public  msgs;

  constructor(private content  : ContentManager,
              private projects : ProjectService,
              private route    : ActivatedRoute,
              private toolbar  : ToolbarService,
              private popup    : PopupService) { 

    // Gets the localized content
    this.msgs = this.content.select('project');
  }

  private saveDocument$ = new Subject<string>();
  private dispose$ = new Subject<void>();

  ngOnInit() {

    // Load the project once
    this.loadProject().subscribe( project => {

      this.project = project;

      // Customizes the action menu according to the project ownership
      let type = project.isMine ? 'owner' : 'guest';

      // Enable actions on the navigation bar depending on the 
      // type of user (owner or guest)
      this.toolbar.activateActions(this.msgs.actions[type])
        .subscribe( code => this.doAction(code) );
    });

    // Save the modified project automatically
    this.saveProject().subscribe( project => {
      this.project.update( project ); 
      this.saved = true; 
    });
  }

  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }

  public enterEditMode(): void {
    // Turns edit mode on 
    this.editMode = true;
  }

  public leaveEditMode(): void {
    
    // Reload the project and turns editMode off
    this.project.reload()
    .toPromise()
    .then( () => {
      this.editMode = false;
    });
  }

  public get document(): wmDocument {
    // Returns the document content
    //return this.project ? this.project.data.document : null ;
    return $document as wmDocument;
  }

  public set document(source: wmDocument) {
    
    // Update the preview and pushes the modified document for async saving
    //this.saveDocument$.next( this.project.data.document = text );
    this.saved = false;
  }

  private loadProject(): Observable<Project> {

    return this.route.paramMap.pipe(
      takeUntil( this.dispose$ ),
      switchMap( param => {
        return this.projects
          .project( param.get('id') )
          .getProject();
      }));
  }

  private saveProject(): Observable<wmProject> {
    return this.saveDocument$.pipe(
      takeUntil( this.dispose$ ),
      debounceTime( 1000 ),
      map( text => { return { document: text } as wmProject; })
    );
  }

  private deleteProject(): void {
    // Ask for confirmation prior to delete the project
    this.popup.confirmPopup(this.msgs.canDelete)
      .subscribe( () => {
        // Deletes the project
        this.project.delete();
      });
  }

  private doAction(code: string){

    switch(code) {

      case 'edit':
      this.enterEditMode();
      break;

      case 'delete':
      this.deleteProject();
      break;
    }
  }

  public canDeactivate() {

    // Ask user for deactivation (leaving the page) when in editMode
    return !this.editMode || this.popup.popupDialog(this.msgs.canLeave);
  }
}
