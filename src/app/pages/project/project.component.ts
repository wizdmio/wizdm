import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService, ProjectService, wmProject } from 'app/core';
import { ToolbarService, ActionEnabler } from 'app/navigator';
import { PopupService } from 'app/shared';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, catchError, take, map, debounceTime, takeUntil } from 'rxjs/operators';
import { $animations } from './project.animations';

const $debug = "# Test with a [link](../../profile)\nFollowed by a simple paragraph _with_ **emphasis** and ~~corrections~~ and a note[^note]\n\n [^note]: this is a note"

@Component({
  selector: 'wm-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: $animations
})
export class ProjectComponent implements OnInit, OnDestroy {

  public project: wmProject;
  public editMode = false;
  public saved = true;
  public msgs;

  constructor(private content  : ContentService,
              private database : ProjectService,
              private route    : ActivatedRoute,
              private toolbar  : ToolbarService,
              private popup    : PopupService) { }


  private saveDocument$ = new Subject<string>();
  private dispose$ = new Subject<void>();

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('project');
    
    // Load the project once first...
    this.loadProject().pipe( take(1) ).subscribe( project => {

      // Customizes the action menu according to the project ownership
      let type = this.database.isProjectMine(project) ? 'owner' : 'guest';

      // Enable actions on the navigation bar depending on the 
      // type of user (owner or guest)
      this.toolbar.activateActions(this.msgs.actions[type])
        .subscribe( code => this.doAction(code) );
    });

    // ...then keep the project in sync reloading changes
    this.loadProject().subscribe( project => {
      this.project = project || { document: $debug } as wmProject;
    });

    // Save the modified project automatically
    this.saveProject().subscribe( project => {
      this.database.updateProject( project ); this.saved = true; } );
  }

  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }

  public enterEditMode(): void {
    this.editMode = true;
  }

  public leaveEditMode(): void {
    this.editMode = false;
  }

  public get document(): string {
    // Returns the document content
    return this.project ? this.project.document : "";
  }

  public set document(text: string) {
    
    // Update the preview and pushes the modified document for async saving
    this.saveDocument$.next( this.project.document = text );
    this.saved = false;
  }

  private loadProject(): Observable<wmProject> {

    return this.route.paramMap.pipe(
      takeUntil( this.dispose$ ),
      switchMap( param => 
        this.database.queryProject( param.get('id') )
      ),
      catchError( error => 
        of({ document: $debug } as wmProject) 
      ));
  }

  private saveProject(): Observable<wmProject> {
    return this.saveDocument$.pipe(
      takeUntil( this.dispose$ ),
      debounceTime( 1000 ),
      map( text => { return { document: text } as wmProject; })
    );
  }

  private doAction(code: string){

    switch(code) {

      case 'edit':
      this.enterEditMode();
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
