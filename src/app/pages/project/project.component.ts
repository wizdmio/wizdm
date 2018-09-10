import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService, ProjectService, Project, wmProject } from 'app/core';
import { ToolbarService, ActionEnabler, ScrollViewService } from 'app/navigator';
import { PopupService, UploadsComponent } from 'app/shared';
import { Observable, Subject, of, empty } from 'rxjs';
import { switchMap, catchError, tap, take, map, filter, debounceTime, takeUntil } from 'rxjs/operators';
import { $animations } from './project.animations';

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

  constructor(private content  : ContentService,
              private projects : ProjectService,
              private route    : ActivatedRoute,
              private toolbar  : ToolbarService,
              private popup    : PopupService,
              private scroll   : ScrollViewService) { 

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
/*
    // ...then keep the project in sync reloading changes
    this.loadProject()
      .pipe( 
        tap( project => this.buffer = project.data ), // Buffers the project for changes during editing
        filter( () => !this.editMode ) // Skips reloading while in editMode
      ) 
      .subscribe( project => {
        this.project = project.data || {} as wmProject;
    });
*/
    // Save the modified project automatically
    this.saveProject().subscribe( project => {
      this.project.update( project ); this.saved = true; } );
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

  public get document(): string {
    // Returns the document content
    return this.project ? this.project.data.document : "";
  }

  public set document(text: string) {
    
    // Update the preview and pushes the modified document for async saving
    this.saveDocument$.next( this.project.data.document = text );
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

  @ViewChild('uploads') uploads: UploadsComponent;

  private changeCover() {

    this.uploads.chooseFile(this.project.data.cover)
      .then( file => {
        if(!!file) {
          // Updates the project with the new cover
          this.project.update({ cover: file.url || null } as wmProject );
        }
      });
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

      case 'cover':
      this.changeCover();
      break;

      case 'delete':
      this.deleteProject();
      break;
    }
  }

  private lastLine = 0;

  public onEditScroll(line: number) {
  
    // Keeps track of the last line the editor view has been scrolled to
    this.lastLine = line;

    // Scrolls the main view to the mardown attribute data-line selector
    // This works based on the feature of wm-markdown component rendering
    // the view with [data-line="number"] attributes tracking the source
    // text line number for every top level element.
    //
    this.scroll.scrollTo(`[data-line="${line}"]`);
  }

  public markdownDone() {

    // When in editMode, makes sure the view is scrolled back to the last 
    // source text known position every time the content changes
    if(this.editMode) {
      this.onEditScroll(this.lastLine);
    }
  }

  public canDeactivate() {

    // Ask user for deactivation (leaving the page) when in editMode
    return !this.editMode || this.popup.popupDialog(this.msgs.canLeave);
  }
}
