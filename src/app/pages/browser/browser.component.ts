import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ContentService, ProjectService, wmProject, Timestamp } from 'app/core';
import { ToolbarService } from 'app/navigator';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { $animations } from './browser.animations';

@Component({
  selector: 'wm-project-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
  animations: $animations
})
export class BrowserComponent implements OnInit, AfterContentInit, OnDestroy {

  private colsBreakpoint = { xl: 5, lg: 4, md: 3, sm: 2, xs: 1 };
  private dispose$: Subject<void> = new Subject();

  public msgs = null;
  public cols = 1;

  public projects: wmProject[] = [];
  public activeTab = 0;
  public loading = false;

  //private filters$ = new BehaviorSubject<QueryFn>(undefined);
  
  constructor(private content: ContentService,
              private toolbar : ToolbarService,
              private database: ProjectService,
              private media: ObservableMedia) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('browser');

    // Enables the toolbar actions
    this.toolbar.activateActions(this.msgs.actions);

    this.loadMyProject();
  }

  ngAfterContentInit() {

    // Adjust the number of grid's columns according to the media breackboint
    this.media.asObservable()
      .pipe( takeUntil( this.dispose$ ) )
      .subscribe((change: MediaChange) => {
        this.cols = this.colsBreakpoint[change.mqAlias];
      });
  }

  ngOnDestroy() {

    // Disposes all the observables. DO NOT FORGET to use takeUntil() operator
    this.dispose$.next();
    this.dispose$.complete();
  }

  public get tabDescription(): string {
    return this.msgs.tabs[this.activeTab].description;
  }

  private loadProjects(tab: number) {

    let source = this.msgs.tabs[tab].source;

    switch(source) {

      default:
      case 'personal':
      this.loadMyProject();
      break;

      case 'pending':
      //this.loadPendingProject();
      break;

      case 'active':
      this.loadActiveProject();
      break;
    }
  }

  private loadMyProject() {

    this.loading = true;

    this.database.listOwnProjects()// ref => ref.orderBy('created', 'asc'))
      .pipe( 
        takeUntil( this.dispose$ ), 
        catchError( () => [] ) 
      )
      .subscribe( (projects: wmProject[]) => {   

        // Return the array of projects sorted by ascendind creation date
        this.projects = projects.sort( (a,b) => { 

          // Turns the firestore timestamps into numbers to be compared
          let an: number = a.created ? a.created.toMillis() : 0;
          let bn: number = b.created ? b.created.toMillis() : 0;
          return an - bn;

        });

        this.loading = false;
      });
  }

  private loadActiveProject() {

    this.loading = true;

    this.database.listProjects(ref => ref.where('status', '>', 'draft')
                                         .where('status', '<', 'draft'))
      .pipe( 
        takeUntil( this.dispose$ ), 
        catchError( () => [] ) 
      )
      .subscribe( (projects: wmProject[]) => {   

        // Return the array of projects sorted by ascendind creation date
        this.projects = projects.sort( (a,b) => { 

          // Turns the firestore timestamps into numbers to be compared
          let an: number = a.created ? a.created.toMillis() : 0;
          let bn: number = b.created ? b.created.toMillis() : 0;
          return an - bn;

        });

        this.loading = false;
      });
  }
/*
  private initFilters(): Observable<wmProject[]> {
    
    return this.filters$.pipe(
      switchMap( qf => {
        return this.projects.listProjects( qf );
      } ),

      // Removes the project marked as 'draft' since these are visible in the 
      // personal dashboard only
      map( results => 
        results.filter( result => 
          result.status != 'draft'
        ) 
      )
    );
  } 

  private queryProjects( qf?: QueryFn ) {
    this.filters$.next( ref => 
      (qf ? qf(ref) : ref).limit(100)
    );
  }

  private queryPendingProjects() {
    this.queryProjects( ref => 
      ref.where('status', '==', 'submitted') 
    );
  }

  private queryMyProjects() {
    this.queryProjects( ref => 
      ref.where('owner', '==', this.projects.owner) 
    );  
  }

  private changeFilters(index: number) {

    switch( index ) {
      
      //case 0: 
      default: // All active projects
      this.queryProjects();
      break;

      case 1: // All pending projects
      this.queryPendingProjects();
      break;

      case 2: // All my projects
      this.queryMyProjects();
      break;
    }
  }
  */
/*
  private checkMyProjects(): Subscription {
    
    // Check for my own projects and reflect the presence in myProjects flag.
    return this.projects.listOwnProjects()
      .pipe( map(v => v.length > 0) )
      .subscribe( result => { 
        this.myProjects = result;
      });
  }*/
}
