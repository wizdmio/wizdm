import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentManager } from '@wizdm/content';
import { ProjectService, Project, wmProject } from '../../core';
import { ToolbarService, ActionEnabler } from '../../navigator';
import { wmDocument } from '../../document/model';
import { PopupService } from '../../elements';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, debounceTime, map } from 'rxjs/operators';
import { $animations } from './editor.animations';

@Component({
  selector: 'wm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  animations: $animations
})
export class EditorComponent implements OnInit, OnDestroy {

  public project: Project;
  public editMode = false;
  public msgs;

  constructor(private content  : ContentManager,
              private projects : ProjectService,
              private route    : ActivatedRoute,
              private toolbar  : ToolbarService,
              private popup    : PopupService) { 

    // Gets the localized content
    this.msgs = this.content.select('editor');
  }

  private saveDocument$ = new Subject<wmDocument>();
  private dispose$ = new Subject<void>();
  public saved$: ActionEnabler;

  ngOnInit() {

    // Load the project once
    this.onLoad().subscribe( project => {

      this.project = project;

      // Enable actions on the navigation bar depending on the type of user (author or guest)
      this.toolbar.activateActions(project.isMine ? this.msgs.authorActions : this.msgs.guestActions )
        .subscribe( code => this.doAction(code) );
    });

    // Save the modified project automatically
    this.onSave().subscribe( data => {

      this.project.update( data )
        .then( () => !!this.saved$ && this.saved$.enable(false) );
    });

  }

  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }

  public enterEditMode(): void {
    // Enables the edit mode actions saving the previous state
    this.toolbar.activateActions( this.msgs.editActions, true)
      .subscribe( code => this.doAction(code) );

    this.saved$ = this.toolbar.actionEnabler('save', false);

    // Turns edit mode on 
    this.editMode = true;
  }

  public leaveEditMode(): void {
    // Reload the project and turns editMode off
    this.project.reload().toPromise()
      .then( () => {
        // Restores the previous actions
        this.toolbar.restoreActions();
        this.editMode = false;
      });
  }

  public get document(): wmDocument {
    // Returns the project content
    return !!this.project && this.project.data;
  }

  public save(document: wmDocument) {

    // Update the preview and pushes the modified document for async saving
    this.saveDocument$.next( document );
    this.saved$.enable(true);
  }

  private onLoad(): Observable<Project> {

    return this.route.paramMap.pipe(
      takeUntil( this.dispose$ ),
      switchMap( param => {
        return this.projects
          .project( param.get('id') )
          .getProject();
      }));
  }

  private onSave(): Observable<wmProject> {
    return this.saveDocument$.pipe(
      takeUntil( this.dispose$ ),
      debounceTime( 1000 ),
      map( document => document as wmProject )
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

      case 'save':
      break;

      case 'done':
      this.leaveEditMode();
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
