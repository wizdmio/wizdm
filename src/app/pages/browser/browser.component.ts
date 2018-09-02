import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ContentService, ProjectService, PagedCollection, Project, wmProject } from 'app/core';
import { ToolbarService, ScrollViewService } from 'app/navigator';
import { Observable, Subject, of } from 'rxjs';
import { map, filter, take, takeUntil, tap } from 'rxjs/operators';
import { $animations } from './browser.animations';

@Component({
  selector: 'wm-project-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
  animations: $animations
})
export class BrowserComponent implements OnInit, AfterContentInit, OnDestroy {

  private colsBreakpoint = { xl: 8, lg: 6, md: 4, sm: 2, xs: 1 };
  private dispose$: Subject<void> = new Subject();

  public msgs = null;
  public cols = 1;

  public allProjects: PagedCollection<Project>;
  public myProjects$: Observable<Project[]>;

  //private filters$ = new BehaviorSubject<dbQueryFn>(undefined);
  
  constructor(private content  : ContentService,
              private toolbar  : ToolbarService,
              private scroll   : ScrollViewService,
              private database : ProjectService,
              private media    : ObservableMedia) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('browser');

    // Enables the toolbar actions
    this.toolbar.activateActions(this.msgs.actions);

    // Creates the observable listing all projects (using pagination)
    // resolving all owners
    this.allProjects = this.database.queryAllProjects();
    /*.projects$
      .pipe( takeUntil( this.dispose$ ));*/

    // Creates the observable listing current user' projects
    this.myProjects$ = this.database.queryOwnProjects()
      .pipe( takeUntil( this.dispose$ ), tap( projects => {
        console.log(projects);
      }) );

    // Subscribes to the scrollPosition event to implement project pagination
    this.scroll.scrollPosition
      // Filters events when the active page does not require pagination
      .pipe( takeUntil(this.dispose$), filter( () => this.tabSource === 'all') )
      // Ask for more data to display when at the bottom of the page
      .subscribe( pos => {
        if(pos === 'bottom') {
          this.allProjects.more();
        }
      });

      // Load the first page of projects
      //this.database.more();
  }

  ngAfterContentInit() {

    // Adjust the number of grid's columns according to the media breakboint
    this.media.asObservable()
      .pipe( takeUntil( this.dispose$ ) )
      .subscribe((change: MediaChange) => {
        this.cols = this.colsBreakpoint[change.mqAlias];
      });
  }

  ngOnDestroy() {

    this.allProjects.dispose();

    // Disposes all the observables. DO NOT FORGET to use takeUntil() operator
    this.dispose$.next();
    this.dispose$.complete();
  }

  public tabIndex = 0;

  public get tabDescription(): string {
    return this.msgs.tabs[this.tabIndex].description;
  }
/*
  public get loading$(): Observable<boolean> {
    return this.database.loading$;
  }
*/
  private get tabSource(): string {
    return this.msgs.tabs[this.tabIndex].value;
  }

  public switchTab(index: number) {
    
    this.tabIndex = index;

    // Returns the relevant observable according to the selected tab
    switch( this.tabSource ) {

      case 'all':// Resets the paging
      this.allProjects.more();
      break;

      case 'mine':
      this.allProjects.reset();
      default:
    }
  }

  public get tabData$(): Observable<Project[]> {

    // Returns the relevant observable according to the selected tab
    switch( this.tabSource ) {

      case 'all':
      return this.allProjects.data$;

      case 'mine':
      return this.myProjects$;

      default:
    }

    return of([]);
  }
/*
  // Updates the project theme
  public updateProject(data: wmProject): void {
    this.database.updateProject(data);
  }
*/
}
