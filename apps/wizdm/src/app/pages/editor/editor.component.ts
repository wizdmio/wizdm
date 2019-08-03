import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { wmRoot } from '@wizdm/editable';
import { ToolbarService } from '../../navigator';
import { ProjectService, ProjectWrapper, wmProject } from '../../core/project';
import { ContentResolver } from '../../core/content';
import { PopupService } from '../../elements/popup';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, takeUntil, debounceTime, map, tap } from 'rxjs/operators';
import { $animations } from './editor.animations';

@Component({
  selector: 'wm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  host: { 'class': 'wm-page adjust-top' },
  animations: $animations
})
export class EditorComponent extends ProjectWrapper implements OnInit, OnDestroy {

  private editMode$ = new BehaviorSubject<boolean>(false);
  private saveDocument$ = new Subject<wmRoot>();
  private dispose$ = new Subject<void>();
  private msgs$: Observable<any>;
  public msgs: any = {};

  constructor(private  projects : ProjectService,
              private  route    : ActivatedRoute,
              private  toolbar  : ToolbarService,
              private  popup    : PopupService,
              readonly content  : ContentResolver) { 

    super(projects, '');

    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = this.content.stream('editor');
  }
  
  ngOnInit() {
    
    // Builds the observable streams
    combineLatest(

      // Gets a snapshot of the current localized content for internal use
      this.msgs$.pipe( tap( msgs => this.msgs = msgs ) ),
      // Loads the project and keeps it in sync
      this.loadProject().pipe( map( project => this.wrap(project) ) )

    ).pipe( 

      // Activates the relevant actions based on the previous
      switchMap( ([msgs, project]) => this.activateActions(project.isMine, msgs) ),
      // Makes sure to dispose the streams when done
      takeUntil(this.dispose$)

      // Perform the action on request
    ).subscribe( code => this.doAction(code) );

    // Enables the auto-saving stream
    this.saveAutomatically();
  }

  ngOnDestroy() {

    super.release();
    this.dispose$.next(); 
    this.dispose$.complete();
  }

  // Actions' handler
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

  // Loads the project content from the route ID parameter
  private loadProject(): Observable<wmProject> {

    return this.route.paramMap.pipe(
      // Gets the routing param id
      map( param => param.get('id') ),
      // Turns the id into a project instance
      switchMap( id => this.projects.getProject(id) )
    );
  }

  // Activates the relevant toolbar actions
  private activateActions(isMine: boolean, msgs: any): Observable<string> {

    return this.editMode$.pipe( 
      
      map( editMode => isMine ? (editMode ? msgs.editActions : msgs.authorActions) : msgs.guestActions ),
      
      switchMap( actions => this.toolbar.activateActions(actions) )
    );
  }

  // Returns the current edit mode status
  get editMode() { return this.editMode$.value; }

  // Enables edit mode
  public enterEditMode() { this.editMode$.next(true); }
  
  // Exits edit mode (this will trigger editable document to update)
  public leaveEditMode() { this.editMode$.next(false); }

  // Pushes the updated document to be saved
  public save(document: wmRoot) { this.saveDocument$.next( document ); }

  // Enables auto-saving
  private saveAutomatically() {

    return this.saveDocument$.pipe(
      // Makes sure to dispose of the streams when done
      takeUntil( this.dispose$ ),
      // Enables the save button every update request
      tap( () => this.toolbar.enableAction('save', true) ),
      // Filters multiple requests
      debounceTime( 1000 ),
      // Saves the updated project data
      switchMap( data => this.update(data as wmProject) ),
      // Disables the save button when done
      tap( () => this.toolbar.enableAction('save', false) )

    ).subscribe();
  }

  // Ask for confirmation prior to delete the project
  private deleteProject() {
    this.popup.confirmPopup(this.msgs.canDelete)
      .subscribe( () => this.delete() );
  }

  public canDeactivate() {
    // Ask user for deactivation (leaving the page) when in editMode
    return !this.editMode || this.popup.popupDialog(this.msgs.canLeave);
  }
}
