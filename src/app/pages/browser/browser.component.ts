import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ContentService, ProjectService, wmProject, QueryFn } from '../../core';
import { Subscription, Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, map, filter, take, delay } from 'rxjs/operators';

@Component({
  selector: 'wm-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit, AfterContentInit, OnDestroy {

  private msgs = null;

  private colsBreakpoint = { xl: 5, lg: 4, md: 3, sm: 2, xs: 1 };
  private cols = 1;

  private filters$ = new BehaviorSubject<QueryFn>(undefined);
  private projects$: Observable<wmProject[]>;

  private subMedia$: Subscription;
  private subMy$: Subscription;

  private myProjects = false;

  constructor(private content: ContentService,
              private projects: ProjectService,
              private observableMedia: ObservableMedia) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('browser');

    this.projects$ = this.initFilters();

    this.subMy$ = this.checkMyProjects();
  }

  ngAfterContentInit() {

    // Adjust the number of grid's columns according to the media breackboint
    this.subMedia$ = this.observableMedia.subscribe((change: MediaChange) => {
      this.cols = this.colsBreakpoint[change.mqAlias];
    });
  }

  ngOnDestroy() {
    
    this.subMedia$.unsubscribe();
    this.subMy$.unsubscribe();
  }

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
/*
  private queryActiveProjects() {
    this.queryProjects();
  }
*/
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

  private checkMyProjects(): Subscription {
    
    // Check for my own projects and reflect the presence in myProjects flag.
    return this.projects.listOwnProjects()
      .pipe( map(v => v.length > 0) )
      .subscribe( result => { 
        this.myProjects = result;
      });
  }
}
