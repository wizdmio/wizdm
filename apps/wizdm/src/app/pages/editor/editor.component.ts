import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { wmRoot, wmItem } from '@wizdm/editable';
import { ToolbarService } from '../../navigator';
import { ContentResolver, ProjectService, Project, wmProject } from '../../core';
import { PopupService } from '../../elements/popup';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, takeUntil, debounceTime, map, tap } from 'rxjs/operators';
import { $animations } from './editor.animations';

@Component({
  selector: 'wm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  host: { 'class': 'wm-page adjust-top' },
  animations: $animations
})
export class EditorComponent implements OnInit, OnDestroy {

  private msgs$: Observable<any>;
  public msgs: any = {};

  private activateActions$ = new BehaviorSubject<boolean>(false);
  private saveDocument$ = new Subject<wmRoot>();
  private dispose$ = new Subject<void>();

  public project: Project;
  public editMode = false;

  constructor(private  projects : ProjectService,
              private  route    : ActivatedRoute,
              private  toolbar  : ToolbarService,
              private  popup    : PopupService,
              readonly content  : ContentResolver) { 

    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = this.content.stream('editor');
  }
  
  ngOnInit() {

    // Gets a snapshot of the current localized content for internal use
    this.msgs$.pipe( takeUntil(this.dispose$) )
      .subscribe( msgs => this.msgs = msgs );

    // Loads the project and keeps it in sync
    this.loadProject().subscribe( prj => this.project = prj );
  
    // Enables automatic save routine
    this.saveAutomatically();

    // Activates the toolbar actions
    this.activateActions();
  }

  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }

  private loadProject(): Observable<Project> {

    return this.route.paramMap.pipe(
      takeUntil( this.dispose$ ),
      // Gets the routing param id
      map( param => param.get('id') ),
      // Turns the id into a project instance
      map( id => this.projects.project( id ) ),
      // Loads the project
      switchMap( prj => prj.getProject() )
    );
  }

  private saveAutomatically() {

    return this.saveDocument$.pipe(
      takeUntil( this.dispose$ ),
      // Enables the save button every update request
      tap( () => this.toolbar.enableAction('save', true) ),
      // Filters multiple requests
      debounceTime( 1000 ),
      // Saves the updated project data
      switchMap( data => this.project.update(data as wmProject) ),
      // Disables the save button when done
      tap( () => this.toolbar.enableAction('save', false) )
    ).subscribe();
  }

  private activateActions() {

    this.activateActions$.pipe(
      takeUntil(this.dispose$),
      // Loads the project first
      switchMap( editMode => this.loadProject().pipe(
        // Checks if the current user is the author
        map( prj => prj.isMine ),
        // Loads the localized content next
        switchMap( isMine => this.msgs$.pipe(
          // Maps the actions accordingly
          map( msgs => {
            return isMine ? (editMode ? msgs.editActions : msgs.authorActions) : msgs.guestActions; 
          } )
        ))
      )),
      // Finally activates the relevant actions
      switchMap( actions => this.toolbar.activateActions(actions) ),
      
      // Subscribes to perform the requested actions
    ).subscribe( code => this.doAction(code) );
  }

  public enterEditMode(): void {
    // Turns edit mode on enabling the relevant actions
    this.activateActions$.next(this.editMode = true);
  }

  public leaveEditMode(): void {
    // Reload the project... 
    this.project.reload().toPromise()
      // ...then turns the editMode off
      .then( () => this.activateActions$.next(this.editMode = false) );
  }

  public get document(): wmRoot {
    // Returns the project content
    return !!this.project && this.project.data;
  }

  public save(document: wmRoot) {
    // Update the preview and pushes the modified document for async saving
    this.saveDocument$.next( document );
  }

  public renderTOC(node: wmItem): string {

    return (node.content || []).reduce( (acc, val) => {
      return val.type === 'text' ? acc + val.value : acc;
    }, '');
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
