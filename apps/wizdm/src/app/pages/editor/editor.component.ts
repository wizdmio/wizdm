import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentStreamer } from '@wizdm/content';
import { RedirectService } from '@wizdm/redirect';
import { wmDocument } from '@wizdm/editable';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { Observable, Subject, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { switchMap, debounceTime, map, tap } from 'rxjs/operators';
import { $animations } from './editor.animations';

@Component({
  selector: 'wm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  animations: $animations,
  providers: [ ContentStreamer ]
})
export class EditorComponent /*extends ProjectWrapper*/ implements OnInit, OnDestroy {

  private editMode$ = new BehaviorSubject<boolean>(false);
  private saveDocument$ = new Subject<wmDocument>();
  private subs: Subscription;

  constructor(//private projects  : ProjectService,
              private route     : ActivatedRoute,
              private redirect  : RedirectService,
              //private popup     : PopupService,
              private content   : ContentStreamer,
              private link      : ActionLinkObserver) { 

    //super(projects, '');
  }

  get msgs(): any { return this.content.select('editor'); }

  get document(): wmDocument {
    return null;
  }
  
  ngOnInit() {
    /*
    // Combines the observables to better handle the page needs
    this.subs = combineLatest(

      // Gets the localized content pre-fetched during routing resolving
      this.content.stream('editor'),
      
      // Loads the project upon the routed 'id' and activates the wrapper to keep it in sync
      this.loadProject().pipe( map( project => this.wrap(project) ) )

    ).pipe( 

      // Activates the relevant toolbar actions based on the previous
      switchMap( ([msgs, project]) => this.activateActions(project.isMine, msgs) )
      
      // Performs the action on request
    ).subscribe( code => this.doAction(code) );

    // Registers to support the 'edit' action link 
    this.subs.add( this.link.register('edit').subscribe( () => this.doAction('edit') ) );

    // Enables the auto-saving
    this.subs.add( this.saveAutomatically() );*/
  }

  ngOnDestroy() {
    // Unsubscribes local observalbles
    this.subs.unsubscribe();
    // Releases the project wrapper observables
    //super.release();
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
    }
  }

  // Loads the project content from the route ID parameter
  private loadProject(): Observable<any> {

    return null;/*this.route.paramMap.pipe(
      // Gets the routing param id
      map( param => param.get('id') ),
      // Turns the id into a project instance
      switchMap( id => this.projects.getProject(id) )
    );*/
  }
/*
  // Activates the relevant toolbar actions
  private activateActions(isMine: boolean, msgs: any): Observable<string> {

    return this.editMode$.pipe( 
      
      map( editMode => isMine ? (editMode ? msgs.editActions : msgs.authorActions) : msgs.guestActions ),
      
      switchMap( actions => this.toolbar.activateActions(actions) )
    );
  }
*/
  // Returns the current edit mode status
  get editMode() { return this.editMode$.value; }

  // Enables edit mode
  public enterEditMode() { this.editMode$.next(true); }
  
  // Exits edit mode (this will trigger editable document to update)
  public leaveEditMode() { this.editMode$.next(false); }

  // Navigates redirecting whenever necessary
  public navigate(url: string) { return this.redirect.navigate(url); }

  // Pushes the updated document to be saved
  public save(document: wmDocument) { this.saveDocument$.next( document ); }
/*
  // Enables auto-saving
  private saveAutomatically() {

    return this.saveDocument$.pipe(
      // Enables the save button every update request
      tap( () => this.toolbar.enableAction('save', true) ),
      // Filters multiple requests
      debounceTime( 1000 ),
      // Saves the updated project data
      switchMap( data => this.update(data as wmProject) ),
      // Disables the save button when done
      tap( () => this.toolbar.enableAction('save', false) )

    ).subscribe();
  }*/
/*
  public canDeactivate() {
    // Ask user for deactivation (leaving the page) when in editMode
    return !this.editMode || this.popup.popupDialog(this.content.select('editor').canLeave);
  }*/
}
